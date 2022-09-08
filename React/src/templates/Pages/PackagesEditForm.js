import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import SelectState from "../../common/SelectState";
import {  useDispatch } from "react-redux";
import classNames from "classnames";
import { getLocations, getSinglePackage } from "../../store/slices/packages";
import { getSubscribers } from "../../store/slices/packages";
import { unwrapResult } from "@reduxjs/toolkit";
import { TextField } from '@mui/material';
import { Autocomplete } from '@mui/material';
import { message } from "antd";
import { updatePackages } from "../../store/slices/packages";
import { getDocuments } from "../../store/slices/documents";
import { ThreeDots } from 'react-loader-spinner';

const PackagesEditForm = (props) => {
  const userid = props.location.state.id;
  const title= props.location.state.title
  const dispatch = useDispatch();
  const history = useHistory();
  const [list, SetList] = useState();
  const [error, SetError] = useState({});
  const [hintData, setHintData] = useState([]);
  const [hintDataloc, setHintDataloc] = useState([]);
  const[allpdf,setAllpdf]=useState([])

  const [data, SetData] = useState({
    title: "",
    field_job_number: "",
    field_subscriber_reference: "",
    field_location_reference: "",
    field_pdf_reference:list,
    body: "",
    field_notes: "",
    field_qr_code: "",
    field_customer_name: "",
    address_line1: "",
    address_line2: "",
    locality: "",
    administrative_area: "",
    postal_code: "",
  });
const[val1,setVal1]=useState()
const[val2,setVal2]=useState()

  useEffect(()=>{
    (async () => {
      try {
        const resultAction = await dispatch(getSinglePackage(userid));
        const hintSubscriber = await dispatch(getSubscribers());
        const hintLocation = await dispatch(getLocations());
        const hintPdfRef=await dispatch(getDocuments())
        const allPdfRef=unwrapResult(hintPdfRef)?.map(key=> ({"id": key.nid, "title":`${key.title} (${key.nid})`}));

        const hintSub = unwrapResult(hintSubscriber).map((key) => {return({"id": key.nid, "title": key.title})});
        // const hintSub = unwrapResult(hintSubscriber).map((key) => {return key.title});

        const hintLoc = unwrapResult(hintLocation).map((key) => {return {"id": key.nid, "title": key.title}});
        // remove duplicates
        function getUniqueListBy(arr, key) {
          return [...new Map(arr.map(item => [item[key], item])).values()]
        }
        const newHintLoc = getUniqueListBy(hintLoc, 'title');
        const originalPromiseResult = unwrapResult(resultAction);
        const pdf_ref=originalPromiseResult?.[0]?.field_pdf_reference
        const pdf_data=pdf_ref!==null && pdf_ref!== undefined &&  Object.values(pdf_ref)?.map((key)=>{return({id:key.id,title:`${key.label}(${key.id})`})});
        const finalList = Object.assign({},pdf_data)
        setVal1((originalPromiseResult?.[0]?.field_subscriber_reference?.id > 0) ? originalPromiseResult?.[0]?.field_subscriber_reference?.label : '')
        setVal2((originalPromiseResult?.[0]?.field_location_reference?.id > 0) ? originalPromiseResult?.[0]?.field_location_reference?.label : '')
        let x = {
          id: originalPromiseResult?.[0].nid,
          title: originalPromiseResult?.[0].title,
          field_job_number: originalPromiseResult?.[0]?.field_job_number?.[0].value,
          field_subscriber_reference: (originalPromiseResult?.[0]?.field_subscriber_reference?.id > 0) ? originalPromiseResult?.[0]?.field_subscriber_reference?.label : '',
          field_location_reference: (originalPromiseResult?.[0]?.field_location_reference?.id > 0) ? originalPromiseResult?.[0]?.field_location_reference?.label : '',
          body: originalPromiseResult?.body,
          field_pdf_reference:list,
          field_notes: originalPromiseResult?.[0]?.field_notes?.[0]?.value,
          field_qr_code: originalPromiseResult?.[0]?.field_qr_code?.[0]?.value,
          field_customer_name:originalPromiseResult?.[0]?.field_customer_name?.[0]?.value,
          address_line1:originalPromiseResult?.[0]?.field_address?.[0]?.address_line1,
          address_line2:originalPromiseResult?.[0]?.field_address?.[0]?.address_line2,
          locality:originalPromiseResult?.[0]?.field_address?.[0]?.locality,
          administrative_area:originalPromiseResult?.[0]?.field_address?.[0]?.administrative_area,
          postal_code:originalPromiseResult?.[0]?.field_address?.[0]?.postal_code,
        };
        SetData({ ...data, ...x });
        setHintData(hintSub);
        setHintDataloc(newHintLoc);
        SetList({...list,...finalList})
        setAllpdf([...allpdf,...allPdfRef])
      
        // handle result here
      } catch (rejectedValueOrSerializedError) {
        // handle error here
      }
    })();
  }, [data.title]);
  // const findId = (myArray, findValue) => {
  //   var item = myArray.findIndex(item => item.title === findValue);
  //   if(item) {
  //     return item;
  //   }
  //   return false;
  // }

  const handleChange = (event) => {
    SetData({ ...data, [event.target.name]: event.target.value });
  };
  const handleClick = (e) => {
    e.preventDefault();
    if (validation()) {
      dispatch(updatePackages(data)).then((response) => {
        if (response.payload.status === 1) {
          message.success("Your changes are saved.");
          history.push("/my-packages")
        }
      });;
    }
  };

  const handleAdd=(e)=>{
    e.preventDefault()
    SetList({...list,[e.target.name]:e.target.value})
    // SetData({...data,field_pdf_reference:list})
  }
  const validation = () => {
    var err = {};
    if (data.field_job_number === "") {
      err["field_job_number"] = "this field is required";
    }
    if (data.address_line1 === "" || data.address_line1===undefined) {
      err["address_line1"] = "this field is required";
    }
    if (data.field_qr_code === "") {
      err["field_qr_code"] = "this field is required";
    }
    if (data.administrative_area === "" ||data.administrative_area === undefined) {
      err["administrative_area"] = "this field is required";
    }
    if (data.field_customer_name === "") {
      err["field_customer_name"] = "this field is required";
    }
    if (data.field_location_reference === "") {
      err["field_location_reference"] = "this field is required";
    }
    if (data.field_subscriber_reference === "") {
      err["field_subscriber_reference"] = "this field is required";
    }
    if (data.locality === "" || data.locality=== undefined) {
      err["locality"] = "this field is required";
    }
    if (data.postal_code === "" || data.postal_code=== undefined) {
      err["postal_code"] = "this field is required";
    }
    SetError({ ...err });
    return Object.values(err).length < 1 && true;
  };

  ;return (
    <>
       {
       !(data.title) ? <ThreeDots className="loader" color="#DDDDDD" height={50} width={50} /> : <>
        <h1>{title}</h1>
        <form>
          <div
            className={classNames(
              "form-item",
              error.field_job_number !== "" && error.field_job_number && "error"
            )}
          >
            <label>
              Job Number{" "}
              <span className="form-required" title="This field is required.">
                *
              </span>
            </label>
            <input
              className="form-control"
              type="text"
              name="field_job_number"
              value={data.field_job_number}
              onChange={handleChange}
            />
            <span>Please enter a unique job number for this package</span>
          </div>
          <div
            className={classNames(
              "form-item",
              error.field_subscriber_reference !== "" && error.field_subscriber_reference && "error"
            )}
          >
            <label>
              Subscriber Reference{" "}
              <span className="form-required" title="This field is required.">
                *
              </span>
            </label>
       {
        <Autocomplete
        value={val1}
        onChange={(event, newValue) => {
          var id=hintData.find(key=>key.title===newValue)

          setVal1(newValue)
          SetData({...data,field_subscriber_reference:id?.id});
        }}
       
        id="controllable-states-demo"
        options={hintData.map(key=>key.title)}
        renderInput={(params) => <TextField {...params} label="Controllable" />}
      />

       }
            <span>Please enter the date that this package should expire</span>
          </div>

          <div
            className={classNames(
              "form-item",
              error.field_location_reference !== "" && error.field_location_reference && "error"
            )}
          >
            <label>
              Location Reference{" "}
              <span className="form-required" title="This field is required.">
                *
              </span>
            </label>
            {
               <Autocomplete
               value={val2}
               onChange={(event, newValue) => {
             
                var id=hintDataloc.find(key=>key.title===newValue)
               
                 setVal2(newValue)
                 SetData({...data,field_location_reference:id?.id});
               }}
              
               id="controllable-states-demo"
               options={hintDataloc.map(key=>key.title)}
               renderInput={(params) => <TextField {...params} label="Controllable" />}
             />
            }
            <span>Please enter a unique job number for this package</span>
          </div>
          <div className="form-item">
            <label>Body</label>
            <span>
              Include any custom notes related to this jobsite package here.
              Data entered in this field will only be visible to package authors
              and site administrators
            </span>
            <textarea
              className="form-control"
              name="body"
              cols="60"
              rows="2"
              value={data.body}
              onChange={handleChange}
            />
          </div>
          <div
            className={classNames(
              "form-item",
              error.jobSitePackage !== "" && error.jobSitePackage && "error"
            )}
          >
            <label>
              PDF Reference{" "}
              <span className="form-required" title="This field is required.">
                *
              </span>
            </label>
            <span>Please choose a package from the list below</span>
           {
            list && <> 
            {Object.values(list)?.map((key, id) => {
              return (
                <Autocomplete
                  key={id}
                  disablePortal
                  className="hintDisplay"
                  name={id}
                  options={allpdf}
                  defaultValue={key}
                  getOptionLabel={(option) => option.title || ""}
                  isOptionEqualToValue={(option, value) => option.title === value.title}
                  onChange={(key, newValue) => {
                    SetList({ ...list, [id]: newValue })
                    SetData({ ...data,field_pdf_reference:{ ...list, [id]: newValue }});
                  }}
                  renderInput={(params) => <TextField {...params} label="" />}
                />
              );
            })}
          </>
           }
           <button onClick={handleAdd}>Add</button>
          </div>
          <div className="form-item">
            <label>Notes</label>
            <span>
              Include any custom notes related to this jobsite package here.
              Data entered in this field will only be visible to package authors
              and site administrators
            </span>
            <textarea
              className="form-control"
              name="field_notes"
              cols="60"
              rows="2"
              value={data.field_notes}
              onChange={handleChange}
            />
          </div>

          <div
            className={classNames(
              "form-item",
              error.field_qr_code !== "" && error.field_qr_code && "error"
            )}
          >
            <label>
              QR Code{" "}
              <span className="form-required" title="This field is required.">
                *
              </span>
            </label>
            <input
              className="form-control"
              name="field_qr_code"
              value={data.field_qr_code}
              onChange={handleChange}
            />
            <span>Please enter a unique job number for this package</span>
          </div>
          <div className="form-group">
            <h3 className="bottom-border">Jobsite Address</h3>
            <span>
              Please enter the street address including specific building
              details for the jobsite using the fields below.
            </span>
            <div
              className={classNames(
                "form-item",
                error.address_line1 !== "" && error.address_line1 && "error"
              )}
            >
              <label>
                Address{" "}
                <span className="form-required" title="This field is required.">
                  *
                </span>
              </label>
              <input
                className="form-control"
                type="text"
                name="address_line1"
                value={data.address_line1}
                placeholder=""
                onChange={handleChange}
              />
            </div>
            <div className="form-item">
              <label>Address 2</label>
              <input
                className="form-control"
                type="text"
                name="address_line2"
                value={data.address_line2}
                placeholder=""
                onChange={handleChange}
              />
            </div>
            <div
              className={classNames(
                "form-item",
                error.locality !== "" && error.locality && "error"
              )}
            >
              <label>
                City{" "}
                <span className="form-required" title="This field is required.">
                  *
                </span>
              </label>
              <input
                className="form-control"
                type="text"
                name="locality"
                placeholder=""
                value={data.locality}
                onChange={handleChange}
              />
            </div>
            <div
              className={classNames(
                "form-item",
                error.administrative_area !== "" && error.administrative_area && "error"
              )}
            >
              <label>
                State/Province{" "}
                <span className="form-required" title="This field is required.">
                  *
                </span>
              </label>
              <SelectState
                val={data.administrative_area}
                method={SetData}
                data1={data}
              />
            </div>
            <div
              className={classNames(
                "form-item",
                error.postal_code !== "" && error.postal_code && "error"
              )}
            >
              <label>
                Zip Code{" "}
                <span className="form-required" title="This field is required.">
                  *
                </span>
              </label>
              <input
                className="form-control"
                type="text"
                name="postal_code"
                placeholder=""
                value={data.postal_code}
                onChange={handleChange}
              />
            </div>
          </div>
          <div
              className={classNames(
                "form-item",
                error.field_customer_name !== "" && error.field_customer_name && "error"
              )}
            >
            <label>Customer</label>
            <input
              className="form-control"
              type="text"
              placeholder="Name"
              name="field_customer_name"
              value={data.field_customer_name}
              onChange={handleChange}
            />
            <span>
              The name of the customer or client that this package is being
              generated for.
            </span>
          </div>

          <button className="btn btn-danger btn-md" onClick={handleClick}>
            Submit
          </button>
        </form>
        
        </>
       }
     
    </>
  );
};

export default PackagesEditForm;
