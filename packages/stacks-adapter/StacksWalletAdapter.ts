import { AppConfig, UserSession, showConnect } from '@stacks/connect';

export class StacksWalletAdapter {
  private appConfig: AppConfig;
  private userSession: UserSession;

  constructor() {
    this.appConfig = new AppConfig(['store_write', 'publish_data']);
    this.userSession = new UserSession({ appConfig: this.appConfig });
  }

  isSessionSignedIn(): boolean {
    return this.userSession.isUserSignedIn();
  }

  async connect(appName: string, appIconUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.isSessionSignedIn()) {
         resolve(this.userSession.loadUserData().profile.stxAddress.mainnet);
         return;
      }

      showConnect({
        appDetails: {
          name: appName,
          icon: appIconUrl,
        },
        redirectTo: '/',
        onFinish: () => {
          const userData = this.userSession.loadUserData();
           resolve(userData.profile.stxAddress.mainnet);
        },
        onCancel: () => {
          reject('User canceled');
        },
      });
    });
  }
  
  getUserData() {
    if(this.isSessionSignedIn()){
        return this.userSession.loadUserData();
    }
    return null;
  }
  
  disconnect() {
    this.userSession.signUserOut();
  }
}
