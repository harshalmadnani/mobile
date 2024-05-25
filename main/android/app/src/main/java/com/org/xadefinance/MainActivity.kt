package com.org.xadefinance

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {
  // private  lateinit var binding: ActivityMainBinding _//add here_
  //   override fun onCreate(savedInstanceState: Bundle?) {
  //       super.onCreate(savedInstanceState)
  //       binding = ActivityMainBinding.inflate(layoutInflater) _//add here_
  //       val view = binding.root _//add here_
  //       setContentView(view) _//add here_
  //       //setContentView(R.layout.activity_main)
  //   }

  //   fun degistir(view : View){
  //       binding.textView.text = "Hello Android" _//worked_
  //   }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "Xade Mobile"

  /* Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
  * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
  */
  
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
