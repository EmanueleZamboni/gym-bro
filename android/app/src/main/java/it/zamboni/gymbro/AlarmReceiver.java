package it.zamboni.gymbro;

import android.app.Notification;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.media.AudioAttributes;
import android.media.AudioFocusRequest;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.os.PowerManager;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.os.VibratorManager;

import androidx.core.app.NotificationCompat;

/** Fires at the end of rest: bell, then GO crunch, ducking whatever music is playing. */
public class AlarmReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context ctx, Intent intent) {
        final PendingResult result = goAsync();
        PowerManager pm = (PowerManager) ctx.getSystemService(Context.POWER_SERVICE);
        final PowerManager.WakeLock wl = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "gymbro:alarm");
        wl.acquire(6000);

        String goTitle = intent.getStringExtra("goTitle");
        String goBody = intent.getStringExtra("goBody");
        RestTimerPlugin.createChannels(ctx);
        Notification n = new NotificationCompat.Builder(ctx, RestTimerPlugin.CH_ALARM)
            .setSmallIcon(R.drawable.ic_stat_timer)
            .setContentTitle(goTitle == null ? "GO!!" : goTitle)
            .setContentText(goBody == null ? "" : goBody)
            .setAutoCancel(true)
            .setContentIntent(RestTimerPlugin.openAppIntent(ctx))
            .setCategory(NotificationCompat.CATEGORY_ALARM)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .setTimeoutAfter(20000)
            .build();
        RestTimerPlugin.notifySafe(ctx, n);

        vibrate(ctx, new long[]{0, 220, 90, 220, 90, 420});
        final Sounds s = new Sounds(ctx.getApplicationContext());
        s.play(R.raw.alarm, () -> {
            vibrate(ctx, new long[]{0, 60, 30, 140});
            s.play(R.raw.go, () -> { s.release(); try { wl.release(); } catch (Exception ignored) {} result.finish(); });
        });
    }

    static void vibrate(Context ctx, long[] pattern) {
        try {
            Vibrator v;
            if (Build.VERSION.SDK_INT >= 31) v = ((VibratorManager) ctx.getSystemService(Context.VIBRATOR_MANAGER_SERVICE)).getDefaultVibrator();
            else v = (Vibrator) ctx.getSystemService(Context.VIBRATOR_SERVICE);
            if (v == null || !v.hasVibrator()) return;
            if (Build.VERSION.SDK_INT >= 26) v.vibrate(VibrationEffect.createWaveform(pattern, -1));
            else v.vibrate(pattern, -1);
        } catch (Exception ignored) {}
    }

    /** MediaPlayer with transient-may-duck audio focus, so music dips instead of stopping. */
    static class Sounds {
        private final Context ctx;
        private final AudioManager am;
        private AudioFocusRequest focus;
        private MediaPlayer mp;
        private final Handler handler = new Handler(Looper.getMainLooper());

        Sounds(Context ctx) {
            this.ctx = ctx;
            this.am = (AudioManager) ctx.getSystemService(Context.AUDIO_SERVICE);
            requestFocus();
        }

        private void requestFocus() {
            try {
                AudioAttributes attrs = new AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_MEDIA)
                    .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION).build();
                if (Build.VERSION.SDK_INT >= 26) {
                    focus = new AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK)
                        .setAudioAttributes(attrs).setOnAudioFocusChangeListener(f -> {}).build();
                    am.requestAudioFocus(focus);
                } else {
                    am.requestAudioFocus(f -> {}, AudioManager.STREAM_MUSIC, AudioManager.AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK);
                }
            } catch (Exception ignored) {}
        }

        void play(int resId, Runnable then) {
            final boolean[] done = { false };
            final Runnable once = () -> { if (done[0]) return; done[0] = true; then.run(); };
            try {
                if (mp != null) { mp.release(); mp = null; }
                mp = MediaPlayer.create(ctx, resId);
                if (mp == null) { once.run(); return; }
                mp.setOnCompletionListener(p -> once.run());
                mp.setOnErrorListener((p, w, e) -> { once.run(); return true; });
                mp.start();
                handler.postDelayed(once, 3000); // safety net if completion never fires
            } catch (Exception e) { once.run(); }
        }

        void release() {
            try { if (mp != null) { mp.release(); mp = null; } } catch (Exception ignored) {}
            try {
                if (Build.VERSION.SDK_INT >= 26 && focus != null) am.abandonAudioFocusRequest(focus);
            } catch (Exception ignored) {}
        }
    }
}
