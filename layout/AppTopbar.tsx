/* eslint-disable @next/next/no-img-element */
import getConfig from 'next/config';
import Link from 'next/link';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import { AppTopbarRef, LayoutConfig } from '../types/types';
import { LayoutContext } from './context/layoutcontext';
import { useState } from 'react';
const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { layoutConfig, setLayoutConfig, layoutState, setLayoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const [isDark, setIsDark] = useState(false);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    const changeTheme = () => {
        let theme: string;
        let colorScheme: string;
        if (isDark) {
            theme = 'tailwind-light';
            colorScheme = 'light';
            setIsDark(false);
        } else {
            theme = 'vela-orange';
            colorScheme = 'dark';
            setIsDark(true);
        }

        const themeLink = document.getElementById('theme-css') as HTMLLinkElement;
        const themeHref = themeLink ? themeLink.getAttribute('href') : null;
        const newHref = themeHref ? themeHref.replace(layoutConfig.theme, theme) : null;
        replaceLink(themeLink, newHref, () => {
            setLayoutConfig((prevState: LayoutConfig) => ({ ...prevState, theme, colorScheme }));
        });
    };

    const NightMode = () => {
        isDark ? setIsDark(false) : setIsDark(true);
        changeTheme();
    };

    const replaceLink = (linkElement: HTMLLinkElement, href: string | null, onComplete: Function) => {
        if (!linkElement || !href) {
            return;
        }

        const id = linkElement.getAttribute('id') as string;
        const cloneLinkElement = linkElement.cloneNode(true) as HTMLLinkElement;

        cloneLinkElement.setAttribute('href', href);
        cloneLinkElement.setAttribute('id', id + '-clone');

        linkElement.parentNode?.insertBefore(cloneLinkElement, linkElement.nextSibling);

        cloneLinkElement.addEventListener('load', () => {
            linkElement.remove();

            const element = document.getElementById(id); // re-check
            element && element.remove();

            cloneLinkElement.setAttribute('id', id);
            onComplete && onComplete();
        });
    };

    return (
        <div className="layout-topbar">
            <Link href="/" className="layout-topbar-logo">
                <img src={`${contextPath}/layout/images/logo-${layoutConfig.colorScheme !== 'light' ? 'white' : 'dark'}.svg`} width="47.22px" height={'35px'} alt="logo" />
                <span>RAJ FEKAR</span>
            </Link>

            <button title="menubutton" ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                <i className="pi pi-bars" />
            </button>

            <button title="show-profile" ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                <i className="pi pi-ellipsis-v" />
            </button>

            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
                <button type="button" className="p-link layout-topbar-button" onClick={NightMode}>
                    <i className="pi pi-moon"></i>
                    <span>Dark</span>
                </button>
                <button type="button" className="p-link layout-topbar-button">
                    <i className="pi pi-user"></i>
                    <span>Profile</span>
                </button>
                <Link href="/">
                    <button type="button" className="p-link layout-topbar-button">
                        <i className="pi pi-cog"></i>
                        <span>Settings</span>
                    </button>
                </Link>
            </div>
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
