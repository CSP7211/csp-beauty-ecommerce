-- Seed sample products into Supabase
-- Run after schema.sql

INSERT INTO products (sku, brand, name, category, size, cost_price, wholesale_price, margin_percent, stock_status, moq, origin, gs1_barcode, clickup_task_id) VALUES
('CSP-FRG-00001', 'Guerlain', 'Guerlain Eau de Parfum Intense 50ml', 'Fragrance', '50ml', 45.00, 60.00, 25, 'In Stock', 6, 'France', '600123456789', '86ca100001'),
('CSP-FRG-00002', 'Chanel', 'Chanel Eau de Toilette Fresh 100ml', 'Fragrance', '100ml', 85.00, 113.33, 25, 'In Stock', 12, 'France', '600123456790', '86ca100002'),
('CSP-FRG-00003', 'Dior', 'Dior Parfum Noir 75ml', 'Fragrance', '75ml', 120.00, 160.00, 25, 'Low Stock', 6, 'France', '600123456791', '86ca100003'),
('CSP-FRG-00004', 'YSL Beauty', 'YSL Beauty Cologne Rose 30ml', 'Fragrance', '30ml', 35.00, 46.67, 25, 'In Stock', 24, 'France', '600123456792', '86ca100004'),
('CSP-FRG-00005', 'Tom Ford', 'Tom Ford Eau de Parfum Woody 150ml', 'Fragrance', '150ml', 180.00, 240.00, 25, 'On Order', 1, 'USA', '600123456793', '86ca100005'),
('CSP-SKN-00001', 'The Ordinary', 'The Ordinary Serum 30ml', 'Skincare', '30ml', 8.50, 11.33, 25, 'In Stock', 24, 'Canada', '600223456789', '86ca200001'),
('CSP-SKN-00002', 'La Roche-Posay', 'La Roche-Posay Moisturizer 50ml', 'Skincare', '50ml', 18.00, 24.00, 25, 'In Stock', 12, 'France', '600223456790', '86ca200002'),
('CSP-SKN-00003', 'CeraVe', 'CeraVe Cleanser 200ml', 'Skincare', '200ml', 12.00, 16.00, 25, 'In Stock', 24, 'USA', '600223456791', '86ca200003'),
('CSP-SKN-00004', 'SK-II', 'SK-II Eye Cream 15ml', 'Skincare', '15ml', 95.00, 126.67, 25, 'Low Stock', 6, 'Japan', '600223456792', '86ca200004'),
('CSP-SKN-00005', 'Babor', 'Babor Face Mask 75ml', 'Skincare', '75ml', 32.00, 42.67, 25, 'In Stock', 12, 'Germany', '600223456793', '86ca200005'),
('CSP-MKP-00001', 'MAC', 'MAC Lipstick Red', 'Makeup', 'N/A', 15.00, 20.00, 25, 'In Stock', 24, 'Canada', '600323456789', '86ca300001'),
('CSP-MKP-00002', 'Dior', 'Dior Foundation Natural 30ml', 'Makeup', '30ml', 42.00, 56.00, 25, 'In Stock', 12, 'France', '600323456790', '86ca300002'),
('CSP-MKP-00003', 'Chanel', 'Chanel Eyeshadow Palette Nude', 'Makeup', 'N/A', 58.00, 77.33, 25, 'Low Stock', 6, 'France', '600323456791', '86ca300003'),
('CSP-MKP-00004', 'Maybelline', 'Maybelline Mascara Black', 'Makeup', 'N/A', 6.00, 8.00, 25, 'In Stock', 48, 'USA', '600323456792', '86ca300004'),
('CSP-MKP-00005', 'Nuxe', 'Nuxe Blush Pink', 'Makeup', 'N/A', 22.00, 29.33, 25, 'In Stock', 12, 'France', '600323456793', '86ca300005'),
('CSP-HRC-00001', 'Kiehl''s', 'Kiehl''s Shampoo 250ml', 'Haircare', '250ml', 18.00, 24.00, 25, 'In Stock', 12, 'USA', '600423456789', '86ca400001'),
('CSP-HRC-00002', 'Aesop', 'Aesop Conditioner 500ml', 'Haircare', '500ml', 28.00, 37.33, 25, 'In Stock', 6, 'Australia', '600423456790', '86ca400002'),
('CSP-HRC-00003', 'L''Oréal Paris', 'L''Oréal Paris Hair Mask 200ml', 'Haircare', '200ml', 8.00, 10.67, 25, 'In Stock', 24, 'France', '600423456791', '86ca400003'),
('CSP-BDC-00001', 'Clarins', 'Clarins Body Lotion 200ml', 'Body Care', '200ml', 24.00, 32.00, 25, 'In Stock', 12, 'France', '600523456789', '86ca500001'),
('CSP-BDC-00002', 'Uriage', 'Uriage Body Wash 400ml', 'Body Care', '400ml', 14.00, 18.67, 25, 'In Stock', 24, 'France', '600523456790', '86ca500002'),
('CSP-MGR-00001', 'L''Oréal Paris', 'L''Oréal Paris Men Face Wash 100ml', 'Men''s Grooming', '100ml', 9.00, 12.00, 25, 'In Stock', 24, 'France', '600623456789', '86ca600001'),
('CSP-SNC-00001', 'La Roche-Posay', 'La Roche-Posay Sunscreen SPF 50 100ml', 'Sun Care', '100ml', 16.00, 21.33, 25, 'In Stock', 12, 'France', '600723456789', '86ca700001'),
('CSP-TLS-00001', 'MAC', 'MAC Makeup Brush Set', 'Tools & Brushes', 'N/A', 45.00, 60.00, 25, 'In Stock', 6, 'Canada', '600823456789', '86ca800001'),
('CSP-SET-00001', 'Guerlain', 'Guerlain Gift Set', 'Sets & Kits', 'Multi', 120.00, 160.00, 25, 'Low Stock', 1, 'France', '600923456789', '86ca900001');
