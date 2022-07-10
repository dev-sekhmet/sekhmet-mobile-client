import {Conversation} from "@twilio/conversations";

export const getFriendlyName = (conv: Conversation, account)=>{
    let attributes: any = null;
    if(typeof conv.attributes === 'string'){
        attributes = JSON.parse(conv.attributes);
    }else{
        attributes = conv.attributes;
    }
    return attributes[account.id] ? `${attributes[account.id].friendlyName}` : conv.friendlyName;
}

export const getImageUrl = (conv: Conversation, account)=>{
    let attributes: any = null;
    if(typeof conv.attributes === 'string'){
        attributes = JSON.parse(conv.attributes);
    }else{
        attributes = conv.attributes;
    }
    if (attributes.imageUrl) {
        return attributes.imageUrl;
    }
    if (attributes[account.id]) {
        return `${attributes[account.id].imageUrl}`;
    }
  return null;
}
