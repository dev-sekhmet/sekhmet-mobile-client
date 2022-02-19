import {Conversation} from "@twilio/conversations";

export const getFriendlyName = (conv: Conversation, account)=>{
    console.log("account.id", account.id)
    console.log("conv.attributes[account.id]",  )
    let name: any = null;
    if(typeof conv.attributes === 'string'){
        name = JSON.parse(conv.attributes);
    }else{
        name = conv.attributes;
    }
    return name[account.id] ? `${name[account.id]}` : conv.friendlyName;
}
