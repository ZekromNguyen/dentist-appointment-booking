import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './TableUserManage.scss';

class TableUserManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
           
        }
    }
    componentDidMount() {
    }

    render() {
        return (

            <table class="container">
                <thead>
                    <tr>
                        <th><h1>Email</h1></th>
                        <th><h1>FirstName</h1></th>
                        <th><h1>LastName</h1></th>
                        <th><h1>Address</h1></th>
                        <th><h1>Action</h1></th>
                    </tr>

                </thead>
                <tbody>


                    <tr>
                        <td>Google</td>
                        <td>9518</td>
                        <td>6369</td>
                        <td>01:32:50</td>
                        <td>
                            <button className="btn-edit"><i className="fas fa-pencil-alt"></i></button>
                            <button className="btn-delete"><i className="fas fa-trash"></i></button>
                        </td>
                    </tr>
                    <tr>
                        <td>Twitter</td>
                        <td>7326</td>
                        <td>10437</td>
                        <td>00:51:22</td>
                        <td>
                            <button className="btn-edit"><i className="fas fa-pencil-alt"></i></button>
                            <button className="btn-delete"><i className="fas fa-trash"></i></button>
                        </td>
                    </tr>
                    <tr>
                        <td>Amazon</td>
                        <td>4162</td>
                        <td>5327</td>
                        <td>00:24:34</td>
                        <td>
                            <button className="btn-edit"><i className="fas fa-pencil-alt"></i></button>
                            <button className="btn-delete"><i className="fas fa-trash"></i></button>
                        </td>
                    </tr>
                    <tr>
                        <td>LinkedIn</td>
                        <td>3654</td>
                        <td>2961</td>
                        <td>00:12:10</td>
                        <td>
                            <button className="btn-edit"><i className="fas fa-pencil-alt"></i></button>
                            <button className="btn-delete"><i className="fas fa-trash"></i></button>
                        </td>
                    </tr>
                    <tr>
                        <td>CodePen</td>
                        <td>2002</td>
                        <td>4135</td>
                        <td>00:46:19</td>
                        <td>
                            <button className="btn-edit"><i className="fas fa-pencil-alt"></i></button>
                            <button className="btn-delete"><i className="fas fa-trash"></i></button>
                        </td>
                    </tr>

                </tbody>
            </table>


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

export default connect(mapStateToProps, mapDispatchToProps)(TableUserManage);
