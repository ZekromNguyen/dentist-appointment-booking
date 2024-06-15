import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './UserManage.scss';
//import Lightbox from 'react-image-lightbox';
//import 'react-image-lightbox/style.css';
import TableUserManage from './TableUserManage';


class UserManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],
            previewImgURL: '',
            isOpen: false
        }
    }

    async componentDidMount() {

    }
    handleOnchangeImage = (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                previewImgURL: objectUrl

            })
        }
    }

    render() {
        return (
            <div className="User-redux-container" >
                <div className="title">
                    User Manage
                </div>

                <div className="User-redux-body">

                    <div className="container">
                        <div className="row">
                            <div className="col-3">
                                <label> <FormattedMessage id="manager-user.email" /></label>
                                <input className="form-control" type="email" />
                            </div>
                            <div className="col-3">
                                <label> <FormattedMessage id="manager-user.password" /></label>
                                <input className="form-control" type="password" />
                            </div>
                            <div className="col-3">
                                <label> <FormattedMessage id="manager-user.username" /></label>
                                <input className="form-control" type="text" />
                            </div>

                            <div className="col-3">
                                <label> <FormattedMessage id="manager-user.phone-number" /></label>
                                <input className="form-control" type="text" />
                            </div>

                            <div className="col-3">
                                <label> <FormattedMessage id="manager-user.role" /></label>
                                <select className="form-control">
                                    <option selected>Choose...</option>
                                    <option>...</option>
                                </select>
                            </div>
                            <div className="col-3">
                                <label> <FormattedMessage id="manager-user.image" /></label>
                                <div className="preview-img-container">
                                    <input id="previewImg" type="file" hidden
                                        onChange={(event) => this.handleOnchangeImage(event)}

                                    />
                                    <label className="label-upload" htmlFor="previewImg">Tải Ảnh <i className="fas fa-upload"></i></label>
                                    <div className="preview-image"

                                        style={{ backgroundImage: `url(${this.state.previewImgURL})` }}

                                    ></div>
                                </div>

                            </div>
                            <div className="col-12 my-3">
                                <button className="btn btn-primary"><FormattedMessage id="manager-user.save" /></button>
                            </div>
                        </div>
                    </div>
                    <TableUserManage/>
                </div>
            </div>
            
           
        )
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

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
