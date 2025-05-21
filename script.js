
    let products = [];
    document.getElementById('imgInput').addEventListener('change', function (e) {
        const file = e.target.files[0];
        const img = document.getElementById('logoPreview');
        if (!file) {
            img.style.display = 'none';
            img.src = '#';
            return;
        }
        const reader = new FileReader();
        reader.onload = function (evt) {
            img.src = evt.target.result;
            img.style.display = 'block';
        };
        reader.readAsDataURL(file);
    });
    function addItem() {
        const name = document.getElementById('prdName').value.trim();
        const code = document.getElementById('prdCode').value.trim();
        const price = parseFloat(document.getElementById('prdPrice').value) || 0;
        const qty = parseInt(document.getElementById('prdQty').value) || 0;
        if (!name || !code || price <= 0 || qty <= 0) {
            alert('Please enter valid product details.');
            return;
        }
        products.push({ name, code, price, qty });
        document.getElementById('prdName').value = '';
        document.getElementById('prdCode').value = '';
        document.getElementById('prdPrice').value = '';
        document.getElementById('prdQty').value = '';
        updatePreview();
    }
    function updatePreview() {
        document.getElementById('prevInvoiceNum').textContent = document.getElementById('invoiceNum').value || '#0001';
        document.getElementById('prevInvoiceDate').textContent = document.getElementById('invoiceDate').value || 'YYYY-MM-DD';
        document.getElementById('prevDueDate').textContent = document.getElementById('dueDate').value || 'YYYY-MM-DD';
        document.getElementById('prevBillFrom').textContent =
            (document.getElementById('companyName').value || 'Company Name') + ', ' +
            (document.getElementById('companyAdd').value || 'Address') + ', ' +
            (document.getElementById('companyPh').value || 'Phone') + ', ' +
            (document.getElementById('companyEm').value || 'Email') + ', ' +
            (document.getElementById('companyTax').value || 'Tax No');
        document.getElementById('prevBillTo').textContent =
            (document.getElementById('customerName').value || 'Customer Name') + ', ' +
            (document.getElementById('customerAdd').value || 'Address') + ', ' +
            (document.getElementById('customerPh').value || 'Phone') + ', ' +
            (document.getElementById('customerEm').value || 'Email') + ', ' +
            (document.getElementById('customerTax').value || 'Tax No');
        const tbody = document.getElementById('prevProductBody');
        tbody.innerHTML = '';
        let subtotal = 0;
        if (products.length === 0) {
            tbody.innerHTML = `<tr>
            <td>N/A</td><td>N/A</td><td>0.00</td><td>0</td><td>0.00</td>
        </tr>`;
        } else {
            products.forEach(p => {
                const total = p.price * p.qty;
                subtotal += total;
                const tr = document.createElement('tr');
                tr.innerHTML = `<td>${p.name}</td><td>${p.code}</td><td>${p.price.toFixed(2)}</td><td>${p.qty}</td><td>${total.toFixed(2)}</td>`;
                tbody.appendChild(tr);
            });
        }
        const taxRate = parseFloat(document.getElementById('tax').value) || 0;
        const discountRate = parseFloat(document.getElementById('discount').value) || 0;
        const tax = subtotal * (taxRate / 100);
        const discount = subtotal * (discountRate / 100);
        const total = subtotal + tax - discount;
        document.getElementById('prevTax').textContent = tax.toFixed(2);
        document.getElementById('prevDiscount').textContent = discount.toFixed(2);
        document.getElementById('prevSubtotal').textContent = total.toFixed(2);
        const totalSpan = document.querySelector('.left [style*="Total"] + span');
        if (totalSpan) totalSpan.textContent = total.toFixed(2);
    }
    [
        'invoiceNum', 'invoiceDate', 'dueDate', 'companyTax', 'customerTax', 'companyName', 'customerName',
        'companyAdd', 'customerAdd', 'companyPh', 'customerPh', 'companyEm', 'customerEm', 'tax', 'discount'
    ].forEach(id => {
        document.getElementById(id).addEventListener('input', updatePreview);
    });
    updatePreview();
