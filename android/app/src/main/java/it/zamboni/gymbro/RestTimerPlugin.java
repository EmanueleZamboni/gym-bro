package it.zamboni.gymbro;

import android.Manifest;
import android.app.AlarmManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.view.WindowManager;

import androidx.core.app.ActivityCompat;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * Native rest timer: an exact alarm-clock alarm (fires with the screen off and in Doze),
 * a live countdown notification driven by Android's chronometer, and our own sounds.
 */
@CapacitorPlugin(name = "RestTimer")
public class RestTimerPlugin extends Plugin {
    static final String CH_TIMER = "rest_timer";
    static final String CH_ALARM = "rest_alarm";
    static final int NOTIF_ID = 1001;
    static final int REQ_ALARM = 2001;
    static final int REQ_OPEN = 2002;

    @Override
    public void load() {
        createChannels(getContext());
    }

    static void createChannels(Context ctx) {
        if (Build.VERSION.SDK_INT < 26) return;
        NotificationManager nm = ctx.getSystemService(NotificationManager.class);
        NotificationChannel timer = new NotificationChannel(CH_TIMER, "Rest countdown", NotificationManager.IMPORTANCE_LOW);
        timer.setSound(null, null);
        timer.enableVibration(false);
        timer.setShowBadge(false);
        NotificationChannel alarm = new NotificationChannel(CH_ALARM, "Rest over", NotificationManager.IMPORTANCE_HIGH);
        alarm.setSound(null, null); // the app plays its own bell and GO
        alarm.enableVibration(false);
        alarm.setShowBadge(false);
        nm.createNotificationChannel(timer);
        nm.createNotificationChannel(alarm);
    }

    static PendingIntent openAppIntent(Context ctx) {
        Intent open = new Intent(ctx, MainActivity.class);
        open.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        return PendingIntent.getActivity(ctx, REQ_OPEN, open, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    static PendingIntent alarmIntent(Context ctx, Intent fire) {
        return PendingIntent.getBroadcast(ctx, REQ_ALARM, fire, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    @PluginMethod
    public void start(PluginCall call) {
        Double endAtD = call.getDouble("endAt");
        if (endAtD == null) { call.reject("endAt required"); return; }
        long endAt = endAtD.longValue();
        String title = call.getString("title", "Rest");
        String body = call.getString("body", "");
        String goTitle = call.getString("goTitle", "GO!!");
        String goBody = call.getString("goBody", "");
        Context ctx = getContext();
        ensurePermission();

        Notification n = new NotificationCompat.Builder(ctx, CH_TIMER)
            .setSmallIcon(R.drawable.ic_stat_timer)
            .setContentTitle(title)
            .setContentText(body)
            .setOngoing(true)
            .setOnlyAlertOnce(true)
            .setSilent(true)
            .setUsesChronometer(true)
            .setChronometerCountDown(true)
            .setWhen(endAt)
            .setShowWhen(true)
            .setContentIntent(openAppIntent(ctx))
            .setCategory(NotificationCompat.CATEGORY_ALARM)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .build();
        notifySafe(ctx, n);

        Intent fire = new Intent(ctx, AlarmReceiver.class);
        fire.putExtra("goTitle", goTitle);
        fire.putExtra("goBody", goBody);
        AlarmManager am = (AlarmManager) ctx.getSystemService(Context.ALARM_SERVICE);
        am.cancel(alarmIntent(ctx, fire));
        am.setAlarmClock(new AlarmManager.AlarmClockInfo(endAt, openAppIntent(ctx)), alarmIntent(ctx, fire));
        call.resolve();
    }

    @PluginMethod
    public void cancel(PluginCall call) {
        cancelAll(getContext());
        call.resolve();
    }

    static void cancelAll(Context ctx) {
        AlarmManager am = (AlarmManager) ctx.getSystemService(Context.ALARM_SERVICE);
        am.cancel(alarmIntent(ctx, new Intent(ctx, AlarmReceiver.class)));
        NotificationManagerCompat.from(ctx).cancel(NOTIF_ID);
    }

    @PluginMethod
    public void dismiss(PluginCall call) {
        NotificationManagerCompat.from(getContext()).cancel(NOTIF_ID);
        call.resolve();
    }

    @PluginMethod
    public void keepAwake(PluginCall call) {
        final boolean on = Boolean.TRUE.equals(call.getBoolean("on", true));
        getActivity().runOnUiThread(() -> {
            if (on) getActivity().getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
            else getActivity().getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        });
        call.resolve();
    }

    @PluginMethod
    public void requestPermission(PluginCall call) {
        ensurePermission();
        call.resolve();
    }

    private void ensurePermission() {
        if (Build.VERSION.SDK_INT >= 33 &&
            ActivityCompat.checkSelfPermission(getContext(), Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(getActivity(), new String[]{Manifest.permission.POST_NOTIFICATIONS}, 77);
        }
    }

    static void notifySafe(Context ctx, Notification n) {
        try { NotificationManagerCompat.from(ctx).notify(NOTIF_ID, n); } catch (SecurityException ignored) {}
    }
}
