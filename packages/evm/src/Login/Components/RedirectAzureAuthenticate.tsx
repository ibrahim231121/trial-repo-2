import { useMsal } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";
import { AzureADSignIn } from "../Components/AzureADSignIn";

const RedirectAzureAuthenticate = () => {

    const { inProgress } = useMsal();

     if (inProgress !== InteractionStatus.Startup && inProgress !== InteractionStatus.HandleRedirect) {
        // inProgress check prevents sign-in button from being displayed briefly after returning from a redirect sign-in. Processing the server response takes a render cycle or two
         return <AzureADSignIn />;
    
    } else {
        return null;
    }
}

export default RedirectAzureAuthenticate;