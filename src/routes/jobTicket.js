const { createJobTicket, getJobTickets, getAllJobTickets, deleteJobTicket } = require("../controllers/jobTicketController");
const authMiddleware = require("../middlewares/authMiddleware");
const dtoValidator = require("../middlewares/dtoValidator");
const { createJobTicketDto } = require("../validators/ticket");

const router = require("express").Router();
router.use(authMiddleware);
router.post(
  "/create",
  createJobTicketDto,
  dtoValidator,
  createJobTicket
);
router.get('/job/:jobId',getJobTickets);
router.get('/all',getAllJobTickets);
router.delete('/delete/:id',deleteJobTicket);

module.exports = router;
