import axios from 'axios';

const BASE_URL = 'https://api.frankfurter.app';

export async function buscarCotacao(de, para) {
    const response = await axios.get(`${BASE_URL}/latest?from=${de}&to=${para}`);

    if (!response.data?.rates?.[para]) {
        throw new Error('Cotação indisponível');
    }

    return response.data.rates[para];
}

export async function converterMoeda(valor, de, para) {
    const cotacao = await buscarCotacao(de, para);
    return valor * cotacao;
}
