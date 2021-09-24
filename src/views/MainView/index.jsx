import React, {useState, useEffect } from 'react'
import { Card, CardBody, CardTitle, Container, Col, Row, Spinner } from 'reactstrap'
import 'react-dropzone-uploader/dist/styles.css'
import './dropzone.css'
import Dropzone from 'react-dropzone-uploader'
import { addExample, load } from '../../components/clasificador/clasificador'

const MainView = () => {
    const [loadingNet, setLoadingNet] = useState(true)
    const [frontal, setFrontal] = useState(0)
    const [posterior, setPosterior] = useState(0)
    useEffect(() => {
        load(setLoadingNet)
    },[])

    // specify upload params and url for your files
    const getUploadParams = ({ meta }) => { return { url: 'https://httpbin.org/post' } }
    
    // called every time a file's `status` changes
    const handleChangeStatus = ({ meta, file }, status) => { if(status === "done") console.log(meta.name+" Cargada correctamente") }
    
    // receives array of files that are done uploading when submit button is clicked
    const handleSubmitFrontal = (files, allFiles) => {
        console.log("Entrenando clasificador con la parte frontal del documento")
        allFiles.forEach((f,index) => {
            console.log("Agregando imagen #"+index+" al modelo")
            addExample(f.meta.previewUrl,0)
            setFrontal(frontal+1)
        })
        allFiles.forEach(f => f.remove())
    }

    const handleSubmitPosterior = (files, allFiles) => {
        allFiles.forEach((f,index) => {
            console.log("Agregando imagen #"+index+" al modelo")
            addExample(f.meta.previewUrl,1)
            setPosterior(posterior+1)
        })
        allFiles.forEach(f => f.remove())
    }

    const handleSubmitEvaluate = (files, allFiles) => {
        console.log("Evaluando documento")
        allFiles.forEach(f => f.remove())
    }
    
    return(
        <Container>
                {loadingNet? <Spinner color="primary" />:
                (<>
                    <Card  style={{margin: '20px'}}>
                    <CardTitle style={{textAlign:'center'}}> <h2><b>Entrenar clasificador </b></h2></CardTitle>
                    <CardBody style={{textAlign:'center'}}>
                        <p>Las imagenes utilizadas para entrenar los modelos deben ser en lo posible de las mismas dimensiones</p>
                        <p>Agrega un minimo de 10 imagenes por cara</p>
                        <Row>
                            <Col>
                                <Card>
                                    <CardTitle style={{textAlign:'center'}}><b>Parte frontal</b></CardTitle>
                                    <CardBody>
                                        <Dropzone
                                            getUploadParams={getUploadParams}
                                            onChangeStatus={handleChangeStatus}
                                            maxFiles={10}
                                            multiple={true}
                                            canCancel={false}
                                            accept = "image/jpeg, image/png, image/jpg"
                                            onSubmit={handleSubmitFrontal}
                                            submitButtonContent={"Entrenar"}
                                            inputWithFilesContent={"Agregar más"}
                                            inputContent={(files,extra) => (extra.reject ? 'Solo estan perimitidos archivos PNG y JPG' :(
                                                <Col key='infoCol'>
                                                <p key='infoP'>arrastra hasta aqui o presiona para seleccionar</p>
                                                </Col>
                                                ))}
                                            styles={{dropzoneActive:{borderColor: 'green'},dropzoneReject: { borderColor: 'red', backgroundColor: '#DAA' },inputLabel: (files, extra) => (extra.reject ? { color: 'red' } : {}),}}
                                                /> 
                                            {frontal>0? <p>Has cargado {frontal} imagenes a este modelo</p>:""}
                                    </CardBody>
                            </Card>
                            </Col>
                            <Col>
                                <Card>
                                <CardTitle style={{textAlign:'center'}}><b>Parte posterior</b></CardTitle>
                                <CardBody>
                                    <Dropzone
                                        getUploadParams={getUploadParams}
                                        onChangeStatus={handleChangeStatus}
                                        maxFiles={10}
                                        multiple={true}
                                        canCancel={false}
                                        accept = "image/jpeg, image/png, image/jpg"
                                        onSubmit={handleSubmitPosterior}
                                        submitButtonContent={"Entrenar"}
                                        inputWithFilesContent={"Agregar más"}
                                        inputContent={(files,extra) => (extra.reject ? 'Solo estan perimitidos archivos PNG y JPG' :(
                                            <Col key='infoCol'>
                                            <p key='infoP'>arrastra hasta aqui o presiona para seleccionar</p>
                                            </Col>
                                            ))}
                                        styles={{dropzoneActive:{borderColor: 'green'},dropzoneReject: { borderColor: 'red', backgroundColor: '#DAA' },inputLabel: (files, extra) => (extra.reject ? { color: 'red' } : {}),}}
                                            /> 
                                            {posterior>0? <p>Has cargado {posterior} imagenes a este modelo</p>:""}
                                </CardBody>
                            </Card>
                            </Col>
                    </Row>
                </CardBody>
            </Card>
            <Card  style={{margin: '20px'}}>
                <CardTitle style={{textAlign:'center'}}><h2><b>Evalua clasificador </b></h2></CardTitle>
                <CardBody>
                    <Dropzone
                        getUploadParams={getUploadParams}
                        onChangeStatus={handleChangeStatus}
                        maxFiles={1}
                        multiple={false}
                        canCancel={false}
                        accept = "image/jpeg, image/png, image/jpg"
                        onSubmit={handleSubmitEvaluate}
                        submitButtonContent={"Entrenar"}
                        inputWithFilesContent={"Agregar más"}
                        inputContent={(files,extra) => (extra.reject ? 'Solo estan perimitidos archivos PNG y JPG' :(
                            <Col key='infoCol' style={{textAlign:'center'}}>
                            <p key='infoP'>arrastra hasta aqui o presiona para seleccionar</p>
                            </Col>
                            ))}
                        styles={{dropzoneActive:{borderColor: 'green'},dropzoneReject: { borderColor: 'red', backgroundColor: '#DAA' },inputLabel: (files, extra) => (extra.reject ? { color: 'red' } : {}),}}
                            /> 
                </CardBody>
                </Card>
                </>
                )}            
        </Container>
    )
}

export default MainView