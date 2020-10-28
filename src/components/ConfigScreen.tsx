import React, { Component } from 'react';
import { AppExtensionSDK } from 'contentful-ui-extensions-sdk';
import { Heading, Form, Workbench, Paragraph, TextField } from '@contentful/forma-36-react-components';
import { css } from 'emotion';

export interface AppInstallationParameters {
  deeplApiKey: string;
}

interface ConfigProps {
  sdk: AppExtensionSDK;
}

interface ConfigState {
  parameters: AppInstallationParameters;
}

export default class Config extends Component<ConfigProps, ConfigState> {
  constructor(props: ConfigProps) {
    super(props);
    this.state = {
      parameters: {
        deeplApiKey: ''
      }
    };

    // `onConfigure` allows to configure a callback to be
    // invoked when a user attempts to install the app or update
    // its configuration.
    props.sdk.app.onConfigure(() => this.onConfigure());
  }

  async componentDidMount() {
    // Get current parameters of the app.
    // If the app is not installed yet, `parameters` will be `null`.
    const parameters: AppInstallationParameters | null = await this.props.sdk.app.getParameters();

    this.setState(parameters ? { parameters } : this.state, () => {
      // Once preparation has finished, call `setReady` to hide
      // the loading screen and present the app to a user.
      this.props.sdk.app.setReady();
    });
  }

  onConfigure = async () => {
    // This method will be called when a user clicks on "Install"
    // or "Save" in the configuration screen.
    // for more details see https://www.contentful.com/developers/docs/extensibility/ui-extensions/sdk-reference/#register-an-app-configuration-hook

    // Get current the state of EditorInterface and other entities
    // related to this app installation
    const currentState = await this.props.sdk.app.getCurrentState();

    return {
      // Parameters to be persisted as the app configuration.
      parameters: this.state.parameters,
      // In case you don't want to submit any update to app
      // locations, you can just pass the currentState as is
      targetState: currentState
    };
  };
  
  updateApiKey = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("updateApiKey -> value", event?.target?.value)
    this.setState({ parameters: { deeplApiKey: event.target.value }});
  };

  render() {
    return (
      <Workbench className={css({ margin: '80px' })}>
        <Form>
          <Heading>App Config</Heading>
          <Paragraph>Welcome to the DeepL Translation App. In order to use this app, you need to have a DeepL Pro API account. <a href="https://www.deepl.com/pro#developer" target="_blank" rel="noreferrer">Click here to sign up for a new account</a> or <a href="https://www.deepl.com/pro-account.html" target="_blank" rel="noreferrer" >click here to visit your DeepL account summary</a> and copy your Authentication key. Then paste your DeepL API key below and click the Install or Save button in the upper right.</Paragraph>
          <TextField
            required
            name="deeplApiKey"
            id="deeplApiKey"
            labelText="DeepL API Key"
            value={this.state.parameters.deeplApiKey}
            onChange={this.updateApiKey}
          />
        </Form>
      </Workbench>
    );
  }
}
