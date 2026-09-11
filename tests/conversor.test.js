import { describe, it, expect, afterEach, jest } from '@jest/globals';

jest.unstable_mockModule('axios', () => ({
    default: { get: jest.fn() },
}));

const axios = (await import('axios')).default;
const { buscarCotacao, converterMoeda } = await import('../src/conversor.js');

const BASE_URL = 'https://api.frankfurter.app';

describe('buscarCotacao - mock da API', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('deve retornar a cotação quando a API responde com sucesso', async () => {
        axios.get.mockResolvedValue({
            data: { rates: { BRL: 5 } },
        });

        await expect(buscarCotacao('USD', 'BRL')).resolves.toBe(5);
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/latest?from=USD&to=BRL`);
    });

    it('deve rejeitar quando ocorre um erro de rede', async () => {
        axios.get.mockRejectedValue(new Error('Erro de rede'));

        await expect(buscarCotacao('USD', 'BRL')).rejects.toThrow('Erro de rede');
        expect(axios.get).toHaveBeenCalledTimes(1);
    });

    it('deve lançar erro quando a resposta não possui a cotação', async () => {
        axios.get.mockResolvedValue({
            data: { rates: {} },
        });

        await expect(buscarCotacao('USD', 'BRL')).rejects.toThrow('Cotação indisponível');
        expect(axios.get).toHaveBeenCalledTimes(1);
    });
});

describe('Conversor de moedas - mock de modulo', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Deve converter usando a taxa devolvida pela API', async () => {
        axios.get.mockResolvedValue({
            data: { rates: { BRL: 5 } },
        });

        const resultado = await converterMoeda(10, 'USD', 'BRL');
        expect(resultado).toBe(50);
    });

    it('Deve propagar o erro quando a requisição falha', async () => {
        axios.get.mockRejectedValue(new Error('Erro de rede'));

        await expect(converterMoeda(10, 'USD', 'BRL')).rejects.toThrow('Erro de rede');
    });
});
