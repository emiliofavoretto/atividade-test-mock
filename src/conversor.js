import { afterEach, jest } from '@jest/globals';

jest.unstable_mockModule('axios', () => ({
    default: { get: jest.fn() },
}));

const axios = (await import('axios')).default;

describe('Conversor de moedas - mock de modulo', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Deve converter usando a taxa devolvida pela API', async () => {
        axios.get.mockResolvedValue({
            data: { amount: 1, base: 'USD', rates: { BRL: 5 } },
        });

        const resultado = await converterMoeda(10, 'USD', 'BRL');
        expect(resultado).toBe(50);
    });

    it('Deve propagar o erro quando a requisição falha', async () => {
        axios.get.mockRejectedValue(new Error('Network Error'));
    });
});
