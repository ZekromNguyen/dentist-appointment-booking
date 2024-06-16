import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './ScheduleManage.scss';

class ScheduleManage extends Component {


  render() {
    return (
      <div className="container manage-schedule-container">
      <div className="m-s-title">
          <FormattedMessage id="manage-schedule.title" />
      </div>

      <div className="row">
          <div className="col-md-3 form-group">
              <label htmlFor="doctorSelect">Chọn bác sĩ</label>
              <select id="doctorSelect" className="form-control">
                  <option>Bác sĩ A</option>
                  <option>Bác sĩ B</option>
                  <option>Bác sĩ C</option>
              </select>
          </div>
          <div className="col-md-3 form-group">
              <label htmlFor="dateSelect">Chọn ngày</label>
              <input id="dateSelect" type="date" className="form-control" />
          </div>
      </div>

      <div className="row">
          <div className="col-md-12 pick-hour-container">
              {/* Nội dung của pick-hour-container */}
          </div>
      </div>

      <div className="row">
          <div className="col-md-12">
              <button className="btn btn-primary">Save</button>
          </div>
      </div>
  </div>
    );



  }

}

const mapStateToProps = state => {
  return {
  };
};

const mapDispatchToProps = dispatch => {
  return {
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleManage);
