import React, { useState, useEffect } from "react";
import { useParams, withRouter } from "react-router-dom";
import { Container } from "reactstrap";
import { getSubscriber } from "../../store/slices/packages";
import "./page.template.less";
import { connect } from "react-redux";

/**
 * Subscriber Package Template
 * @export
 * @class SubscriberTemplate
 * @extends {Component}
 */
function SubscriberTemplate(props) {
  const { getSubscriber, user } = props;
  const { subscriberId } = useParams();

  useEffect(() => {
    getSubscriber(subscriberId);
  }, [getSubscriber, subscriberId]);

  const { subscriber } = props.packages.data;

  const tableData = subscriber?.assigned_users_location;
  const [filter, SetFilter] = useState({
    test_mode: "any",
    page: 5,
  });
  let data = tableData
    ?.filter(
      (key) => key?.field_testing[0].value.toString() !== filter.test_mode
    )
    ?.slice(0, filter.page);
  const handleChange = (e) => {
    SetFilter({ ...filter, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Container className="subscriber">
        {user.isLoggedIn && subscriber && (
          <div className="col-sm-12">
            {subscriber?.field_logo?.url && (
              <div className="subscriber--logo">
                <img
                  className="img-responsive"
                  src={subscriber?.field_logo?.url}
                  width="275"
                  height="53"
                  alt={`${subscriber?.title}`}
                />
              </div>
            )}
            {subscriber?.field_website?.length > 0 && (
              <div className="subscriber--website">
                <label>Web Site:&nbsp;</label>
                <div className="field-item">
                  <a href={`${subscriber?.field_website[0].uri}`}>
                    {subscriber?.field_website[0].title
                      ? subscriber?.field_website[0].title
                      : subscriber?.field_website[0].uri}
                  </a>
                </div>
              </div>
            )}
            {subscriber?.field_primary_contact_name?.length > 0 && (
              <div className="subscriber--contact-number">
                <label>Primary Contact Name:&nbsp;</label>
                <div className="field-item">
                  {subscriber?.field_primary_contact_name[0].value}
                </div>
              </div>
            )}
            {subscriber?.field_email?.length > 0 && (
              <div className="subscriber--contact-email">
                <label>Email:&nbsp;</label>
                <div className="field-item">
                  <a href={`mailto:${subscriber?.field_email[0].value}`}>
                    {subscriber?.field_email[0].value}
                  </a>
                </div>
              </div>
            )}
            {subscriber?.field_phone?.length > 0 && (
              <div className="subscriber--contact-phone">
                <label>Phone :&nbsp;</label>
                <div className="field-item">
                  {subscriber?.field_phone[0].value}
                </div>
              </div>
            )}
            {subscriber?.field_coid?.length > 0 && (
              <div className="subscriber--coid">
                <label>COID:&nbsp;</label>
                <div className="field-item">
                  {subscriber?.field_coid[0].value}
                </div>
              </div>
            )}
            <div className="subscriber--locations">
              <h2 className="title">Locations</h2>
              <div className="header">
                This view shows locations grouped by company id. You can adjust
                the filters to limit the list to include only locations that are
                actively using the system by setting the testing filter below to
                "off." Displaying 1 - 1 of 1.
              </div>

              <div className="Filter">
                <div className="TestMode">
                  <div>
                    <label>
                      <b>Test Mode</b>
                    </label>
                  </div>
                  <select name="test_mode" onChange={handleChange}>
                    <option value={null}>Any</option>
                    <option value={true}>Off</option>
                    <option value={false}>ON</option>
                  </select>
                </div>

                <div className="TestMode">
                  <div>
                    <label>
                      <b>Item Per Page</b>
                    </label>
                  </div>
                  <select name="page" onChange={handleChange}>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                    <option value={tableData?.length}>- All -</option>
                  </select>
                </div>
                {/* <div className="ApplyFilter">
                <button className="btn btn-info form-submit" onClick={handleClick}>Apply</button>
              </div> */}
              </div>
            </div>
            <div className="FilterData table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Division</th>
                    <th>LOCID</th>
                    <th>State</th>
                    <th>City</th>
                    <th>Test Mode</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((key) => {
                    return (
                      <>
                        <tr>
                          <td>{key.title}</td>
                          <td>
                            {key?.field_locid?.length > 0
                              ? key?.field_locid[0].value
                              : ""}
                          </td>
                          <td>
                            {key?.address?.length > 0
                              ? key?.address[0].administrative_area
                              : ""}
                          </td>
                          <td>
                            {key?.address?.length > 0
                              ? key?.address[0].locality
                              : ""}
                          </td>
                          <td>
                            {key?.field_testing[0].value === true
                              ? "ON"
                              : "OFF"}
                          </td>
                        </tr>
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Container>
    </>
  );
}

const mapStateToProps = (state) => ({
  ...state,
  user: state.user,
  packages: state.packages,
});

const mapDispatchToProps = (dispatch) => ({
  getSubscriber: (nid) => dispatch(getSubscriber(nid)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(SubscriberTemplate));
