import React, { useState, useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl"; // set backend to webgl
import Loader from "./components/loader";
import ButtonHandler from "./components/btn-handler";
import { detectImage } from "./utils/detect";
import "./style/App.css";


const App = () => {

  const [loading, setLoading] = useState({ loading: true, progress: 0 }); // loading state
    const [results, setResults] = useState([]); // Store results for each image

  const [model, setModel] = useState({
    net: null,
    inputShape: [1, 0, 0, 3],
  }); // init model & input shape

  // references
  const imageRef = useRef(null);
  const canvasRef = useRef(null);

  // model configs
  const modelName = "cancer";
  const classThreshold = 0.2;
  const loadModelBasedOnType = async (modelUrl) => {
    try {
      // Fetch the model.json file
      const response = await fetch(modelUrl);
      const modelJson = await response.json();
  
      // Try loading the model using different functions
      let loadedModel = null;
  
      // Try loading as a graph model
      try {
        loadedModel = await tf.loadGraphModel(modelUrl);
        return loadedModel;
      } catch (error) {
        console.warn("Failed to load as a graph model:", error);
      }
  
      // Try loading as a layers model
      try {
        loadedModel = await tf.loadLayersModel(modelUrl);
        return loadedModel;
      } catch (error) {
        console.warn("Failed to load as a layers model:", error);
      }

  
      // Add more loading attempts as needed...
  
      // If none of the attempts succeed, log an error
      console.error("Failed to load the model. Unsupported model type.");
      return null;
    } catch (error) {
      console.error("Failed to load model:", error);
      return null;
    }
  };

  useEffect(() => {
    
    tf.ready().then(async () => {
      

      // console.log(loadModelBasedOnType(
      //   `${window.location.href}${modelName}_web_model/model.json`
      // ))

      const loadedModel = await loadModelBasedOnType(
        `${window.location.href}${modelName}_web_model/model.json`
      );
     
      // warming up model
      // console.log("Model Inputs:", loadedModel.inputs[0].shape);
      // console.log("new method",tf.ones([1, ...loadedModel.inputs[0].shape.slice(1)]))
      // // console.log(loadedModel.executeAsync(loadedModel.inputs[0].shape))
      // console.log(loadedModel.executeAsync(tf.ones([1, ...loadedModel.inputs[0].shape.slice(1)])))

      // if (loadedModel) {
        // const dummyInput = tf.ones([1, ...loadedModel.inputs[0].shape.slice(1)]); // Set batch size to 1

        // let warmupResult;
        // if (loadedModel.executeAsync) {
        //   warmupResult = await loadedModel.executeAsync(dummyInput);
        // } else if (loadedModel.predict) {
        //   warmupResult = loadedModel.predict(dummyInput);
        // }

        // tf.dispose(warmupResult);
        // tf.dispose(dummyInput);

      //   setLoading({ loading: false, progress: 1 });

      //   setModel({
      //     net: loadedModel,
      //     inputShape: loadedModel.inputs[0].shape,
      //   });
      // } else {
      //   setLoading({ loading: false, progress: 0 });
      //   console.error("Failed to load the model");
      // }
    //   const dummyInput = tf.ones([1, ...loadedModel.inputs[0].shape.slice(1)]); // Set batch size to 1
    // console.log("Model Inputs:", loadedModel.inputs);
    //   const warmupResult = await loadedModel.executeAsync(dummyInput);
    //   await warmupResult;
    //   tf.dispose(warmupResult); // cleanup memory
    //   tf.dispose(dummyInput); // cleanup memory

      setLoading({ loading: false, progress: 1 });
      console.log("shape",loadedModel.inputs)
      setModel({
        net: loadedModel,
        inputShape: loadedModel.inputs[0].shape,
      });
      
    });
  }, []);
  return (
    <div className="App">
      {loading.loading && <Loader>Loading model... {(loading.progress * 100).toFixed(2)}%</Loader>}
      <div className="header">
        <h1>📷 Detection App</h1>
        
        <p>
          Serving : <code className="code">{modelName}</code> Detection
        </p>
      </div>

      <div className="content">
      <img
          src="#"
          ref={imageRef}
          onLoad={() => detectImage(imageRef.current, model, classThreshold, canvasRef.current)}
        />
         
{/* 
        <video
          autoPlay
          muted
          ref={cameraRef}
          onPlay={() => detectVideo(cameraRef.current, model, classThreshold, canvasRef.current)}
        />
        <video
          autoPlay
          muted
          ref={videoRef}
          onPlay={() => detectVideo(videoRef.current, model, classThreshold, canvasRef.current)}
        /> */}
         <div id="gender"></div>
  <div id="emotion"></div>
        <canvas ref={canvasRef} />
        
      </div>

      <ButtonHandler imageRef={imageRef}  />
    </div>
  );
};

export default App;


