import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import HeaderSystem from '../components/HeaderSystem/HeaderSystem';
class ProductManage extends Component {

    state = {

    }

    componentDidMount() {
    }


    render() {
        return (
            <div className='header'>
                <HeaderSystem />
                <div className="text-center" >
                    Manage products
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

export default connect(mapStateToProps, mapDispatchToProps)(ProductManage);
