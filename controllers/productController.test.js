const productController = require('./productController');
const Product = require('../models/Product');

jest.mock('../models/Product');

describe('Product Controller', () => {
  describe('getAllProducts', () => {
    it('should return all products with status 200', async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockProducts = [{ name: 'Test Product' }];
      Product.find.mockReturnValue({ sort: jest.fn().mockResolvedValue(mockProducts) });

      await productController.getAllProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        results: mockProducts.length,
        data: mockProducts,
      });
    });
  });
}); 