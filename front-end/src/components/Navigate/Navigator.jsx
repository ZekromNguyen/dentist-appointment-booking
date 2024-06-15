import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './Navigator.scss';

const MenuGroup = ({ name, children }) => (
    <li className="menu-group">
        <div className="menu-group-name">
            <FormattedMessage id={name} />
        </div>
        <ul className="menu-list list-unstyled">
            {children}
        </ul>
    </li>
);

const Menu = ({ name, active, link, children, hasSubMenu, onLinkClick, onClick }) => (
    <li className={`menu ${hasSubMenu ? "has-sub-menu" : ""} ${active ? "active" : ""}`}>
        {hasSubMenu ? (
            <>
                <span
                    data-toggle="collapse"
                    className="menu-link collapsed"
                    onClick={onClick}
                    aria-expanded="false"
                >
                    <FormattedMessage id={name} />
                    <div className="icon-right">
                        <i className="far fa-angle-right" />
                    </div>
                </span>
                <div>
                    <ul className="sub-menu-list list-unstyled">
                        {children}
                    </ul>
                </div>
            </>
        ) : (
            <Link to={link} className="menu-link" onClick={onLinkClick}>
                <FormattedMessage id={name} />
            </Link>
        )}
    </li>
);

const SubMenu = ({ name, link, onLinkClick }) => {
    const location = useLocation();
    const isActive = location.pathname === link;

    return (
        <li className={`sub-menu ${isActive ? "active" : ""}`}>
            <Link to={link} className="sub-menu-link" onClick={onLinkClick}>
                <FormattedMessage id={name} />
            </Link>
        </li>
    );
};

const Navigator = ({ menus, onLinkClick }) => {
    const [expandedMenu, setExpandedMenu] = useState({});
    const location = useLocation();

    const toggle = (groupIndex, menuIndex) => {
        const key = `${groupIndex}_${menuIndex}`;
        setExpandedMenu(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const isMenuHasSubMenuActive = (subMenus, link) => {
        if (subMenus) {
            const currentPath = location.pathname;
            for (let subMenu of subMenus) {
                if (subMenu.link === currentPath) {
                    return true;
                }
            }
        }
        return link ? location.pathname === link : false;
    };

    const checkActiveMenu = () => {
        for (let i = 0; i < menus.length; i++) {
            const group = menus[i];
            if (group.menus && group.menus.length > 0) {
                for (let j = 0; j < group.menus.length; j++) {
                    const menu = group.menus[j];
                    if (menu.subMenus && menu.subMenus.length > 0) {
                        if (isMenuHasSubMenuActive(menu.subMenus)) {
                            setExpandedMenu({ [`${i}_${j}`]: true });
                            return;
                        }
                    }
                }
            }
        }
    };

    useEffect(() => {
        checkActiveMenu();
    }, [location]);

    return (
        <ul className="navigator-menu list-unstyled">
            {menus.map((group, groupIndex) => (
                <MenuGroup key={groupIndex} name={group.name}>
                    {group.menus && group.menus.map((menu, menuIndex) => {
                        const isSubMenuActive = isMenuHasSubMenuActive(menu.subMenus, menu.link);
                        const isSubMenuOpen = expandedMenu[`${groupIndex}_${menuIndex}`];
                        return (
                            <Menu
                                key={menuIndex}
                                active={isSubMenuActive}
                                name={menu.name}
                                link={menu.link}
                                hasSubMenu={menu.subMenus}
                                onClick={() => toggle(groupIndex, menuIndex)}
                                onLinkClick={onLinkClick}
                            >
                                {menu.subMenus && menu.subMenus.map((subMenu, subMenuIndex) => (
                                    <SubMenu
                                        key={subMenuIndex}
                                        name={subMenu.name}
                                        link={subMenu.link}
                                        onLinkClick={onLinkClick}
                                    />
                                ))}
                            </Menu>
                        );
                    })}
                </MenuGroup>
            ))}
        </ul>
    );
};

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Navigator);
