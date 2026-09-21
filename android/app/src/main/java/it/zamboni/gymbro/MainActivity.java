package it.zamboni.gymbro;

import android.app.PictureInPictureParams;
import android.app.RemoteAction;
import android.content.res.Configuration;
import android.graphics.drawable.Icon;
import android.os.Build;
import android.os.Bundle;
import android.util.Rational;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;

import com.getcapacitor.BridgeActivity;

import java.util.ArrayList;
import java.util.List;

public class MainActivity extends BridgeActivity {
    private boolean pipEnabled = false;
    private String pipMode = "set";
    private String doneLabel = "DONE", skipLabel = "SKIP", plusLabel = "+15S";

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(RestTimerPlugin.class);
        registerPlugin(UpdaterPlugin.class);
        super.onCreate(savedInstanceState);
        // the web layer plays short chiptune clips from timers, not only from taps
        getBridge().getWebView().getSettings().setMediaPlaybackRequiresUserGesture(false);
    }

    /* ---- picture-in-picture: floating timer with DONE / SKIP / +15S controls ---- */
    public void setPip(boolean enabled, String mode, String done, String skip, String plus) {
        pipEnabled = enabled;
        pipMode = mode == null ? "set" : mode;
        if (done != null) doneLabel = done;
        if (skip != null) skipLabel = skip;
        if (plus != null) plusLabel = plus;
        if (Build.VERSION.SDK_INT >= 26) {
            try { setPictureInPictureParams(buildPipParams()); } catch (Exception ignored) {}
        }
    }

    @RequiresApi(26)
    private RemoteAction action(int icon, String title, String act) {
        return new RemoteAction(Icon.createWithResource(this, icon), title, title, RestTimerPlugin.actionIntent(this, act));
    }

    @RequiresApi(26)
    private PictureInPictureParams buildPipParams() {
        PictureInPictureParams.Builder b = new PictureInPictureParams.Builder().setAspectRatio(new Rational(2, 1));
        List<RemoteAction> actions = new ArrayList<>();
        if ("rest".equals(pipMode)) {
            actions.add(action(R.drawable.ic_pip_skip, skipLabel, "skip"));
            actions.add(action(R.drawable.ic_pip_plus, plusLabel, "plus"));
        } else {
            actions.add(action(R.drawable.ic_pip_done, doneLabel, "done"));
        }
        b.setActions(actions);
        if (Build.VERSION.SDK_INT >= 31) {
            b.setAutoEnterEnabled(pipEnabled);
            b.setSeamlessResizeEnabled(false);
        }
        return b.build();
    }

    @Override
    protected void onUserLeaveHint() {
        super.onUserLeaveHint();
        if (pipEnabled && Build.VERSION.SDK_INT >= 26 && Build.VERSION.SDK_INT < 31) {
            try { enterPictureInPictureMode(buildPipParams()); } catch (Exception ignored) {}
        }
    }

    @Override
    public void onPictureInPictureModeChanged(boolean isInPictureInPictureMode, @NonNull Configuration newConfig) {
        super.onPictureInPictureModeChanged(isInPictureInPictureMode, newConfig);
        if (RestTimerPlugin.instance != null) RestTimerPlugin.instance.emitPip(isInPictureInPictureMode);
    }
}
