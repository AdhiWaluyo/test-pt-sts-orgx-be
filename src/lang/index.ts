import enLangMessage from './en/messages';
import { LangMessage } from '@/types/translation.type';

const enums: Record<string, { messages: LangMessage }> = {
	en: {
		messages: enLangMessage,
	},
};

const langCode = process.env?.APP_LANG ? process.env.APP_LANG?.toLowerCase() : 'en';

const selectedLang = enums[langCode];

const messages: LangMessage = selectedLang.messages;

export { messages };