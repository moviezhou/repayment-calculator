InterestRate = function(rate){
    this.rate = rate / 100;
}

InterestDict = function(){
    this.dict = {"2004":new InterestRate(4.05),"2005":new InterestRate(4.23),"2006":new InterestRate(4.41),
        "2007":new InterestRate(4.59),"2008":new InterestRate(5.22),"2009":new InterestRate(3.87),
        "2010":new InterestRate(3.87),"2011":new InterestRate(4.30),"2012":new InterestRate(4.90),
        "2013":new InterestRate(4.50)};
}

InterestDict.prototype.get_monthly_rate = function(year){
    return this.dict[year].rate / 12;
}


function Borrower(ctra_id,amount,ctra_time,duration){
    this.contract_id = ctra_id;
    this.loan_amount = amount;
    this.ctra_time = ctra_time;
    this.duration = duration;
    var ym = new TwelveAry(this.ctra_time);
    this.repayment_sequence = range_seq(ym, get_months_count(ctra_time,duration));
}

MonthlyPayment = function(serial,principal,interest,principal_balance){
    this.m_PrinInter = (principal + interest).toFixed(2);
    this.serial_num = serial;
    this.m_principal = principal.toFixed(2);
    this.m_interest = interest.toFixed(2);
    this.principal_balance = principal_balance.toFixed(2);
}

/* debug code
MonthlyPayment.prototype.print = function(){
    console.log("%s   %s   %s   %s   %s",this.serial_num,this.m_principal.toFixed(2).toString(),this.m_interest.toFixed(2).toString(),
        this.m_PrinInter.toFixed(2).toString(),this.principal_balance.toFixed(2).toString());
}
*/

RepaymentCalculator = function(interestDict,borrower){
    this.interest_dict = interestDict;
    this.principal = borrower.loan_amount;
    this.loan_months = borrower.duration * 12
    this.remaining_months = this.loan_months;
    this.repayment_seq = borrower.repayment_sequence;
    this.monthly_PriIntr = 0.0;
    this.monthly_interest = 0.0;
    this.monthly_principal = 0.0;
    this.principal_balance = this.principal;
    this.repayment_detail_seq = [];
    this.sum_principal_paid = 0;
    this.sum_interset_paid = 0;
}

RepaymentCalculator.prototype.calc_repay_seq = function(){
    for (var seq in this.repayment_seq){
        this.monthly_PriIntr = this.get_monthly_PrinIntr(this.repayment_seq[seq].substring(0,4));
        var monthly_interest = this.principal_balance * this.interest_dict.get_monthly_rate(this.repayment_seq[seq].substring(0,4));
        var monthly_principal = this.monthly_PriIntr - monthly_interest;
        this.principal_balance = this.principal_balance - monthly_principal;

        var mp = new MonthlyPayment(this.repayment_seq[seq],monthly_principal,monthly_interest,
            this.principal_balance);
        this.repayment_detail_seq.push(mp);
        this.remaining_months = this.remaining_months - 1;
        this.sum_principal_paid += monthly_principal;
        this.sum_interset_paid += monthly_interest;
    }
}
RepaymentCalculator.prototype.get_monthly_PrinIntr = function(year){
    var monthly_rate = this.interest_dict.get_monthly_rate(year);
    return (this.principal_balance * monthly_rate * Math.pow((1 + monthly_rate),
        this.remaining_months)) / (Math.pow(1+monthly_rate,this.remaining_months) - 1);
}

RepaymentCalculator.prototype.print_repay_seq = function(){
    for(var seq in this.repayment_detail_seq)
        this.repayment_detail_seq[seq].print();
}

// Helper class & functions
TwelveAry = function(num){
    this.s_number = num.toString();
    this.s_year = this.s_number.substring(0,4);

    if(this.s_number[4] === 0){
        this.s_month = this.s_number[5];
    }
    else{
        this.s_month = this.s_number.substring(4);
    }
    this.year = parseInt(this.s_year);
    this.month = parseInt(this.s_month);
}

TwelveAry.prototype.add = function(delta_month){
    if(this.month + delta_month <= 12){
        this.month += delta_month;
    }
    else{
        this.year += parseInt((this.month + delta_month) / 12);
        this.month = (this.month + delta_month) % 12;
    }
    return new Array(this.year,this.month);
}

function range_seq(ta, delta_month){
    var sequence = [];

    for(var i = 0;i < delta_month; i++){
        var seq = ta.add(1);
        var str_y = seq[0].toString();

        if(seq[1] < 10){
            str_m = '0' + seq[1].toString();
        }
        else{
            str_m = seq[1].toString();
        }
        str_ym = str_y + str_m;
        sequence.push(str_ym);
    }
    return sequence;
}

function get_months_count(contract_time,duration){
    var count = 0;
    var ym = new TwelveAry(contract_time);
    var time = new Array(ym.year,ym.month);
    var end = new Array(2013,12);
    while(time[0] != end[0] || time[1] != end[1]){
        time = ym.add(1);
        count += 1;
    }
    return count;
}