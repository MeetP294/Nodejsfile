import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { requestUserDetails } from "../../store/slices/user";
import "./user.template.less";
import { getSubscriberInfo } from "../../store/slices/packages";
import { unwrapResult } from "@reduxjs/toolkit";
import { NavLink } from "react-router-dom";
const UserDetail = () => {
  const uid = localStorage.getItem("SBCA__user");
  const dispatch = useDispatch();
  const userData = useSelector((state) => state?.user?.data);
  const SubscriberInfo = useSelector((state) => state?.packages?.data?.subscriberinfo?.[0]);
console.log(uid,userData,SubscriberInfo);
  useEffect(()=>{
    (async() => {
      const id = JSON?.parse(uid).uid;
      const response=await dispatch(requestUserDetails(id))
      const coid=unwrapResult(response)?.subscriber_coid
      dispatch(getSubscriberInfo(coid));
    })();
  }, [uid,dispatch]);
  
  return (
    <>
  
      <div className="user-detail--wrapper">
        <h1 className="page-header">{userData?.name}</h1>
        <ul className="nav-tabs">
          <li className="active"><NavLink to="/user">View</NavLink></li>
          <li><NavLink to="/user/edit">Edit</NavLink></li>
        </ul>
        <div className="field-item inline">
          <strong>Real Name: </strong>
          <span>
            {userData?.firstName} {userData?.lastName}
          </span>
        </div>
        <div className="field-item inline">
          <strong>Company: </strong>
          <NavLink to={`/subscribers/${userData?.company?.nid}`}>
            {userData?.company?.title}
          </NavLink>
        </div>
        <div className="field-item inline">
          <strong>Location: </strong>
          <NavLink to={`${userData?.location?.alias}`}>
            {userData?.location?.title}
          </NavLink>
        </div>

        <h3>History</h3>
        <dl>
          <dt>Member for</dt>
          <dd>{userData?.memberFor}</dd>
        </dl>
      </div>

      <div className="PreviewTable table-responsive">

        <h2 className="sub-header">Subscription Information</h2>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Subscriber Name</th>
              <th>Subscriber UUID</th>
              <th>Authorization Token</th>
            </tr>
          </thead>
          <tbody>
                {SubscriberInfo?.map((key) => {
                  return (
                    <>
                      <tr key={key?.nid}>
                        <td>{key?.nid}</td>
                        <td><NavLink to={`/subscribers/${key?.nid}`}>{key?.title}</NavLink></td>
                        <td>{key?.uid?.[0]?.value}</td>
                        <td>
                          {key?.field_authorization_token?.[0]?.value 
                           }
                        </td> 
                      </tr>
                    </>
                  );
                })}
              </tbody>
        </table>
      </div>
     
    </>
  );
};

export default UserDetail;
