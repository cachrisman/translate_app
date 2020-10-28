import React from 'react';
import { Button, Paragraph } from '@contentful/forma-36-react-components';
import { SidebarExtensionSDK } from 'contentful-ui-extensions-sdk';

interface SidebarProps {
  sdk: SidebarExtensionSDK;
}

const Sidebar = (props: SidebarProps) => {
  return <><Paragraph>Hello Sidebar Component</Paragraph><Button buttonType="primary">Check button</Button></>;

};

export default Sidebar;
