import axios from 'axios';
import { existsSync } from 'fs';

if (existsSync('.env')) {
    process.loadEnvFile();
}

export const BASE_URL = process.env.FRANKFURTER_BASE_URL;

export async function obterCotacao(de, para, http = axios) {
    const { data } = await http.get(BASE_URL, {
        params: { from: de, to: para },
    });

    let taxa;

    if (data.rates) {
        taxa = data.rates[para];
    } else {
        taxa = undefined;
    }

    if (taxa === undefined) {
        throw new Error(`Cotação de ${de} para ${para} indisponivel`);
    }

    return taxa;
}

export async function converterMoeda(valor, de, para, http = fetch) {
    if (typeof valor !== 'number' || valor <= 0) {
        throw new Error('O valor deve ser um número maior que zero');
    }

    if (de === para) {
        return Number(valor.toFixed(2));
    }

    const taxa = await obterCotacao(de, para, http);

    return Number((valor * taxa).toFixed(2));
}
