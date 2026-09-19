package it.zamboni.gymbro;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(RestTimerPlugin.class);
        super.onCreate(savedInstanceState);
        // the web layer plays short chiptune clips from timers, not only from taps
        getBridge().getWebView().getSettings().setMediaPlaybackRequiresUserGesture(false);
    }
}
