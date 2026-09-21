package it.zamboni.gymbro;

import android.Manifest;
import android.app.AlarmManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import android.view.WindowManager;

import androidx.core.app.ActivityCompat;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import com.getcapacitor.JSObject;
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
    static RestTimerPlugin instance;

    @Override
    public void load() {
        instance = this;
        createChannels(getContext());
    }

    @Override
    protected void handleOnDestroy() {
        if (instance == this) instance = null;
    }

    /* notification action buttons -> broadcast -> back to the web layer */
    static PendingIntent actionIntent(Context ctx, String act) {
        Intent i = new Intent(ctx, ActionReceiver.class).setAction("it.zamboni.gymbro.ACT_" + act.toUpperCase()).putExtra("act", act);
        int req = act.equals("done") ? 3001 : act.equals("skip") ? 3002 : 3003;
        return PendingIntent.getBroadcast(ctx, req, i, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    static void dispatch(Context ctx, String act) {
        if (instance != null && instance.getBridge() != null) {
            JSObject d = new JSObject();
            d.put("name", act);
            instance.notifyListeners("action", d, true);
        } else {
            ctx.getSharedPreferences("gymbro", Context.MODE_PRIVATE).edit().putString("pendingAction", act).apply();
            try {
                Intent open = new Intent(ctx, MainActivity.class);
                open.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
                ctx.startActivity(open);
            } catch (Exception ignored) {}
        }
    }

    @PluginMethod
    public void consumeAction(PluginCall call) {
        SharedPreferences sp = getContext().getSharedPreferences("gymbro", Context.MODE_PRIVATE);
        String a = sp.getString("pendingAction", null);
        sp.edit().remove("pendingAction").apply();
        JSObject r = new JSObject();
        r.put("name", a);
        call.resolve(r);
    }

    /* persistent notification while a set is in progress: reps + DONE */
    static void postSet(Context ctx, String title, String body, String doneLabel) {
        createChannels(ctx);
        Notification n = new NotificationCompat.Builder(ctx, CH_TIMER)
            .setSmallIcon(R.drawable.ic_stat_timer)
            .setContentTitle(title)
            .setContentText(body)
            .setOngoing(true)
            .setOnlyAlertOnce(true)
            .setSilent(true)
            .setShowWhen(false)
            .setContentIntent(openAppIntent(ctx))
            .addAction(0, doneLabel == null ? "DONE" : doneLabel, actionIntent(ctx, "done"))
            .setCategory(NotificationCompat.CATEGORY_WORKOUT)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .build();
        notifySafe(ctx, n);
    }

    @PluginMethod
    public void showSet(PluginCall call) {
        Context ctx = getContext();
        ensurePermission();
        AlarmManager am = (AlarmManager) ctx.getSystemService(Context.ALARM_SERVICE);
        am.cancel(alarmIntent(ctx, new Intent(ctx, AlarmReceiver.class)));
        postSet(ctx, call.getString("title", "SET"), call.getString("body", ""), call.getString("doneLabel", "DONE"));
        call.resolve();
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
        Object endAtV = call.getData().opt("endAt");
        long endAt = 0;
        if (endAtV instanceof Number) endAt = ((Number) endAtV).longValue();
        else if (endAtV instanceof String) { try { endAt = (long) Double.parseDouble((String) endAtV); } catch (Exception ignored) {} }
        if (endAt <= 0) { call.reject("endAt required"); return; }
        String title = call.getString("title", "Rest");
        String body = call.getString("body", "");
        String goTitle = call.getString("goTitle", "GO!!");
        String goBody = call.getString("goBody", "");
        String skipLabel = call.getString("skipLabel", "SKIP");
        String plusLabel = call.getString("plusLabel", "+15S");
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
            .addAction(0, skipLabel, actionIntent(ctx, "skip"))
            .addAction(0, plusLabel, actionIntent(ctx, "plus"))
            .setCategory(NotificationCompat.CATEGORY_ALARM)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .build();
        notifySafe(ctx, n);

        Intent fire = new Intent(ctx, AlarmReceiver.class);
        fire.putExtra("goTitle", goTitle);
        fire.putExtra("goBody", goBody);
        fire.putExtra("nextTitle", call.getString("nextTitle"));
        fire.putExtra("nextBody", call.getString("nextBody"));
        fire.putExtra("doneLabel", call.getString("doneLabel", "DONE"));
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
        if (Build.VERSION.SDK_INT >= 33 && getActivity() != null &&
            ActivityCompat.checkSelfPermission(getContext(), Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
            getActivity().runOnUiThread(() -> ActivityCompat.requestPermissions(getActivity(), new String[]{Manifest.permission.POST_NOTIFICATIONS}, 77));
        }
    }

    /* diagnostics: can we show notifications at all? */
    @PluginMethod
    public void notifStatus(PluginCall call) {
        Context ctx = getContext();
        boolean perm = Build.VERSION.SDK_INT < 33 || ActivityCompat.checkSelfPermission(ctx, Manifest.permission.POST_NOTIFICATIONS) == PackageManager.PERMISSION_GRANTED;
        boolean enabled = NotificationManagerCompat.from(ctx).areNotificationsEnabled();
        boolean chTimer = true, chAlarm = true;
        if (Build.VERSION.SDK_INT >= 26) {
            createChannels(ctx);
            NotificationManager nm = ctx.getSystemService(NotificationManager.class);
            NotificationChannel a = nm.getNotificationChannel(CH_TIMER), b = nm.getNotificationChannel(CH_ALARM);
            chTimer = a == null || a.getImportance() != NotificationManager.IMPORTANCE_NONE;
            chAlarm = b == null || b.getImportance() != NotificationManager.IMPORTANCE_NONE;
        }
        JSObject r = new JSObject();
        r.put("permission", perm);
        r.put("enabled", enabled);
        r.put("timerChannel", chTimer);
        r.put("alarmChannel", chAlarm);
        r.put("ok", perm && enabled && chTimer && chAlarm);
        r.put("manufacturer", Build.MANUFACTURER);
        call.resolve(r);
    }

    @PluginMethod
    public void openNotificationSettings(PluginCall call) {
        Context ctx = getContext();
        try {
            Intent i;
            if (Build.VERSION.SDK_INT >= 26) {
                i = new Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS).putExtra(Settings.EXTRA_APP_PACKAGE, ctx.getPackageName());
            } else {
                i = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.parse("package:" + ctx.getPackageName()));
            }
            i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            ctx.startActivity(i);
            call.resolve();
        } catch (Exception e) { call.reject(e.getMessage()); }
    }

    @PluginMethod
    public void openBatterySettings(PluginCall call) {
        Context ctx = getContext();
        try {
            Intent i = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.parse("package:" + ctx.getPackageName()));
            i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            ctx.startActivity(i);
            call.resolve();
        } catch (Exception e) { call.reject(e.getMessage()); }
    }

    @PluginMethod
    public void test(PluginCall call) {
        Context ctx = getContext();
        ensurePermission();
        createChannels(ctx);
        Notification n = new NotificationCompat.Builder(ctx, CH_ALARM)
            .setSmallIcon(R.drawable.ic_stat_timer)
            .setContentTitle(call.getString("title", "GYM BRO · TEST"))
            .setContentText(call.getString("body", "Notifications work."))
            .setAutoCancel(true)
            .setContentIntent(openAppIntent(ctx))
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setTimeoutAfter(15000)
            .build();
        try { NotificationManagerCompat.from(ctx).notify(NOTIF_ID + 1, n); } catch (SecurityException ignored) {}
        call.resolve();
    }

    static void notifySafe(Context ctx, Notification n) {
        try { NotificationManagerCompat.from(ctx).notify(NOTIF_ID, n); } catch (SecurityException ignored) {}
    }
}
