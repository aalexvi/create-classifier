import { loadClassifierFromLocalStorage} from './load-save'

const mobilenet = require('@tensorflow-models/mobilenet')
const tf = require('@tensorflow/tfjs')
const knn = require('@tensorflow-models/knn-classifier')

let net
let classifier = knn.create()

export const load = async (setNetLoading) => {
  console.log('Cargando red..');
  // Load the model.
  net = await mobilenet.load();
  console.log('Red cargada correctamente');
  // Create an object from Tensorflow.js data API which could capture image
  // from the web camera as Tensor.

  classifier = loadClassifierFromLocalStorage()
  setNetLoading(false)
  // Reads an image from the webcam and associates it with a specific class
  // index.
}
export const addExample = async (data,classId) => {
    // Capture an image from the web camera.
    console.log(data)
    console.log(classId)
    let reader = new FileReader();
    reader.readAsDataURL(await fetch(data).then(r => r.blob())); // converts the blob to base64 and calls onload
    reader.onload = async ()=> {
      var image = new Image();
      image.src = reader.result
      image.width = 400
      image.height = 400
      const img = tf.browser.fromPixels(image)
      const activation = net.infer(img, true);
      // Pass the intermediate activation to the classifier.
      classifier.addExample(activation, classId);      
      // Dispose the tensor to release the memory.
      img.dispose();
      if(classId === 0) console.log("Cara frontal agregada")
      if(classId === 1) console.log("Cara posterior agregada")   
    }
    // Get the intermediate activation of MobileNet 'conv_preds' and pass that
    // to the KNN classifier.
}
  

export const predictClass = async(data, setRes) => {
  let reader = new FileReader();
  reader.readAsDataURL(await fetch(data).then(r => r.blob())); // converts the blob to base64 and calls onload
  reader.onload = async ()=> {
    if (classifier.getNumClasses() > 0) {
      var image = new Image();
      image.src = reader.result
      image.width = 600
      image.height = 400
      const img = tf.browser.fromPixels(image)
      const activation = net.infer(img, 'conv_preds');
      // Get the most likely class and confidence from the classifier module.
      const result = await classifier.predictClass(activation);
  
      const classes = ['Frontal', 'Posterior', 'C'];
      //console.log(`prediction: ${classes[result.label]} probability: ${result.confidences[result.label]}`)      
      // Dispose the tensor to release the memory.

      img.dispose();
      const ret = { label: classes[result.label.toUpperCase()],result: result.confidences[result.label]}
      setRes(ret)
    }
  };
}
