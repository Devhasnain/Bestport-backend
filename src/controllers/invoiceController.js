const { Invoice } = require("../schemas");
const { sendSuccess, sendError } = require("../utils");

class InvoiceController {
  static async getInvoices(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const skip = (page - 1) * limit;

      const totalInvoices = await Invoice.countDocuments();

      const invoices = await Invoice.find()
        .populate([
          {
            path: "job",
            select: "title",
          },
          {
            path: "employee",
            select: "name email",
          },
          {
            path: "customer",
            select: "name email",
          },
        ])
        .select([
          "_id",
          "job",
          "employee",
          "customer",
          "amountReceived",
          "totalMaterialCost",
          "createdAt",
        ])
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const formattedInvoices = invoices.map((invoice) => ({
        id: invoice._id,

        job: {
          id: invoice.job?._id,
          title: invoice.job?.title,
        },

        employee: {
          id: invoice.employee?._id,
          name: invoice.employee?.name,
          email: invoice.employee?.email,
        },

        customer: {
          id: invoice.customer?._id,
          name: invoice.customer?.name,
          email: invoice.customer?.email,
        },

        amountReceived: invoice.amountReceived,

        totalMaterialCost: invoice.totalMaterialCost,

        totalProfit: invoice.amountReceived - invoice.totalMaterialCost,

        createdAt: invoice.createdAt,
      }));

      const totalPages = Math.ceil(totalInvoices / limit);

      return sendSuccess(
        res,
        "Invoices fetched successfully",
        {
          pagination: {
            totalInvoices,
            currentPage: page,
            totalPages,
            limit,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
          },

          invoices: formattedInvoices,
        },
        200
      );
    } catch (error) {
      return sendError(res, error.message, 500);
    }
  }

  static async getSingleInvoice(req, res) {
    try {
      const { id } = req.params;

      const invoice = await Invoice.findById(id)
        .populate([
          {
            path: "job",
            select: "title description",
          },
          {
            path: "employee",
            select: "name email profile_img phone position",
          },
          {
            path: "customer",
            select: "name email profile_img phone",
          },
        ])
        .select([
          "_id",
          "job",
          "employee",
          "customer",
          "products",
          "totalMaterialCost",
          "amountReceived",
          "createdAt",
          "updatedAt",
        ]);

      if (!invoice) {
        return sendError(res, "Invoice not found", 404);
      }

      const formattedInvoice = {
        id: invoice._id,

        job: {
          id: invoice.job?._id,
          title: invoice.job?.title,
          description: invoice.job?.description,
        },

        employee: {
          id: invoice.employee?._id,
          name: invoice.employee?.name,
          email: invoice.employee?.email,
          profileImage: invoice.employee?.profile_img,
          phoneNumber: invoice.employee?.phone,
          position: invoice.employee?.position,
        },

        customer: {
          id: invoice.customer?._id,
          name: invoice.customer?.name,
          email: invoice.customer?.email,
          profileImage: invoice.customer?.profile_img,
          phoneNumber: invoice.customer?.phone,
        },

        products: invoice.products,

        productsCount: invoice.products.length,

        totalMaterialCost: invoice.totalMaterialCost,

        amountReceived: invoice.amountReceived,

        totalProfit: invoice.amountReceived - invoice.totalMaterialCost,

        createdAt: invoice.createdAt,

        updatedAt: invoice.updatedAt,
      };

      return sendSuccess(
        res,
        "Invoice fetched successfully",
        formattedInvoice,
        200
      );
    } catch (error) {
      return sendError(res, error.message, 500);
    }
  }
}

module.exports = InvoiceController;
