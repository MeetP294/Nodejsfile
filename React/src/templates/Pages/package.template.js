/* --------------------------------- IMPORTS -------------------------------- */

import React, { useEffect,useState } from "react";
import "./package.template.less";
import { getSinglePackage } from "../../store/slices/packages";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { unwrapResult } from "@reduxjs/toolkit";
import axios from "axios";


/* -------------------------------------------------------------------------- */

/**
 * Package Template
 * @export
 * @class PackageTemplate
 * @extends {Component}
 */
 function PackageTemplate(props) {
   const userid=props.location.state

   const[pdfData,setPdfData]=useState()
   const[data,setData]=useState()
   const dispatch=useDispatch()
   const user=useSelector(state=>state?.user)
   const current_package=useSelector(state=>state?.packages?.data?.current_package)
   useEffect(()=>{
    (async () => {
        const resultAction = await dispatch(getSinglePackage(userid.nid));
        const originalPromiseResult = unwrapResult(resultAction);
        const pdf_ref=originalPromiseResult?.[0]?.field_pdf_reference
        const pdf_data= pdf_ref !== undefined &&  Object.values(pdf_ref).map((key) => key.field_pdf);

        setPdfData(pdf_data)
      
          // function compareFunction(a, b) {
          //   return a.id - b.id;
          // }
          const NotesString=(originalPromiseResult?.field_notes?.[0]?.value)===undefined?"":originalPromiseResult?.field_notes?.[0]?.value
          const customerNamestring=(originalPromiseResult?.field_custumer_namoriginalPromiseResult?.[0]?.value)===undefined?"":originalPromiseResult?.field_custumer_namoriginalPromiseResult?.[0]?.value
          const data = {
            jobNumber: originalPromiseResult?.field_job_number?.[0]?.value,
            ExpirationDate: "2022-10-06",
            Notes:NotesString ,
            PackageDetails: pdf_data,
            Address: originalPromiseResult?.field_address?.[0]?.administrative_area,
            customerName: customerNamestring,
          };
          setData(data)

        })();
      },[userid.nid,dispatch])

   const handleClick=()=>{
     pdfData ?  axios.post(process.env.REACT_APP_API_URLQ,data).then(res=>{let x=res.data.path; setTimeout(()=>window.open(x),3000)}):alert("Pdf is not there")

   }

   return (
    <div className="main-wrapper">

    { user.isLoggedIn && Object.keys(current_package).length > 0 &&
      <div className="col-md-12 package--wrapper">
      <h1>{current_package.title}</h1>
      <div className="package--location-ref">
      <label>Location Reference:&nbsp;</label>
      <span>{current_package.field_location_reference && current_package.field_location_reference.label}</span>
      </div>
      <div className="package--locid">
      <label>LOCID:&nbsp;</label>
      <span>{current_package.field_locid_package.length > 0 && current_package.field_locid_package[0].value}</span>
      </div>
      <div className="package--updated">
      <label>Last Modified:&nbsp;</label>
      <span>{current_package.updated}</span>
      </div>
      { current_package.field_qr_code_image && 
        <div className="package--barcode"
        dangerouslySetInnerHTML={{ __html: current_package.field_qr_code_image }} />
      }
      { current_package.field_pdf &&
        <div className="package--btn-links">
        <button className="btn btn-danger" onClick={handleClick}>PDF&nbsp; <FontAwesomeIcon icon={['far', 'file-pdf']} /></button>
        </div>	
      }
      </div>
    }
    </div>
    );
 }



 export default PackageTemplate