-- Stock >= 0 Constraint
ALTER TABLE "Stock" DROP CONSTRAINT IF EXISTS "stock_gt_zero";
ALTER TABLE "Stock" ADD CONSTRAINT "stock_gt_zero" CHECK ("XS" >= 0 AND "S" >= 0 AND "M" >= 0 AND "L" >= 0 AND "XL" >= 0);
