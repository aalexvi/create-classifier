import * as knnClassifier from "@tensorflow-models/knn-classifier"
import * as tf from '@tensorflow/tfjs'


async function toDatasetObject(dataset) {
  const result= await Promise.all(
    Object.entries(dataset).map(async ([classId,value], index) => {
      const data = await value.data()

      return {
        classId: Number(classId),
        data: Array.from(data),
        shape: value.shape
      }
   })
  )

  return result
}

function fromDatasetObject(datasetObject) {
  return Object.entries(datasetObject).reduce((result, [indexString, {data, shape}]) => {
    const tensor = tf.tensor2d(data, shape)
    const index = Number(indexString)

    result[index] = tensor

    return result
  }, {})

}

const storageKey = "knnClassifier2"

export async function saveClassifierInLocalStorage(classifier) {
  const dataset = classifier.getClassifierDataset()
  const datasetObj = await toDatasetObject(dataset)
  const jsonStr = JSON.stringify(datasetObj)
  localStorage.setItem(storageKey, jsonStr)
  console.log("Modelo guardado en localStorage")
}

export function loadClassifierFromLocalStorage() {
  const classifier= new knnClassifier.KNNClassifier()
  const datasetJson = localStorage.getItem(storageKey)  
  if (datasetJson) {
    const datasetObj = JSON.parse(datasetJson) 
    const dataset = fromDatasetObject(datasetObj)
    classifier.setClassifierDataset(dataset)
    console.log("Classificador cargado")
    return classifier

  }else{
    console.log("Clasificador creado")
    return classifier
  }  
}
