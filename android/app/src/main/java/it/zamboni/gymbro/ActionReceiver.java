package it.zamboni.gymbro;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/** DONE / SKIP / +15S buttons on the notification. */
public class ActionReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context ctx, Intent intent) {
        String act = intent.getStringExtra("act");
        if (act != null) RestTimerPlugin.dispatch(ctx, act);
    }
}
