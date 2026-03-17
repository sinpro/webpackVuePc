export default {
    // 等额本息
    equalPrincipalAndInterest(principal, term, interestRate) {
        let monthlyInterest = interestRate / 12;
        let monthlyRepayment = (principal * monthlyInterest * Math.pow((1 + monthlyInterest), term) / (Math.pow((1 + monthlyInterest), term) - 1)).toFixed(2);
        let arr = [];
        for (let i = 0; i < term; i++) {
            let monthlyPrincipal = (principal * monthlyInterest * Math.pow((1 + monthlyInterest), i) / (Math.pow((1 + monthlyInterest), term) - 1)).toFixed(2);
            arr.push({
                principal: monthlyPrincipal,
                interest: (monthlyRepayment - monthlyPrincipal).toFixed(2),
                total: monthlyRepayment,
                index: i + 1,
            })
        }
        let totalInterest = arr.reduce((total, current) => total + Number(current.interest), 0);
        console.log("repayPlan", arr);
        return {
            repayPlan: arr,
            totalInterest: Number(totalInterest).toFixed(2),
            totalAmount: (Number(principal) + Number(totalInterest)).toFixed(2)
        }
    },

    // 等额本金
    equalPrincipal(principal, term, interestRate) {
        let monthlyInterest = interestRate / 12;
        let arr = [];
        for (let i = 0; i < term; i++) {
            let monthlyRepayPrincipal = (principal / term).toFixed(2);
            let monthlyRepayInterest = ((principal - (principal / term) * i) * monthlyInterest).toFixed(2);
            arr.push({
                principal: monthlyRepayPrincipal,
                interest: monthlyRepayInterest,
                total: (Number(monthlyRepayPrincipal) + Number(monthlyRepayInterest)).toFixed(2),
                index: i + 1,
            })
        }
        let totalInterest = arr.reduce((total, current) => total + Number(current.interest), 0);
        return {
            repayPlan: arr,
            totalInterest: totalInterest.toFixed(2),
            totalAmount: (Number(principal) + Number(totalInterest)).toFixed(2),
        }
    },

    // 按月还息、到期还本
    monthlyInterestAndMaturityPrincipal(principal, term, interestRate) {
        let monthlyInterest = interestRate / 12;
        let arr = [];
        let i = 0
        for (i; i < term - 1; i++) {
            arr.push({
                principal: 0,
                interest: (Number(monthlyInterest) * Number(principal)).toFixed(2),
                total: (Number(monthlyInterest) * Number(principal)).toFixed(2),
                index: i + 1
            })
        }
        arr.push({
            principal: principal,
            interest: (Number(monthlyInterest) * Number(principal)).toFixed(2),
            total: (Number(principal) + Number(monthlyInterest) * Number(principal)).toFixed(2),
            index: i + 1
        });
        let totalInterest = arr.reduce((total, current) => total + Number(current.interest), 0);
        return {
            repayPlan: arr,
            totalInterest: totalInterest.toFixed(2),
            totalAmount: (Number(principal) + Number(totalInterest)).toFixed(2),
        }
    },

    // 按季还息、到期还本
    quarterlyInterestAndMaturityPrincipal(principal, term, interestRate) {
        let monthlyInterest = interestRate / 12;
        let mod = term % 3;
        let num = term / 3;
        let arr = [];
        if (mod === 0) {
            for (let i = 0; i < num - 1; i++) {
                arr.push({
                    principal: 0,
                    interest: (Number(principal) * Number(monthlyInterest) * 3).toFixed(2),
                    total: (Number(principal) * Number(monthlyInterest) * 3).toFixed(2),
                    index: i + 1
                })
            }
            arr.push({
                principal: principal,
                interest: (Number(principal) * Number(monthlyInterest) * 3).toFixed(2),
                total: (Number(principal) + Number(principal) * Number(monthlyInterest) * 3).toFixed(2),
                index: arr.length + 1
            })
        } else {
            for (let i = 0; i < num - 1; i++) {
                arr.push({
                    principal: 0,
                    interest: (Number(principal) * Number(monthlyInterest) * 3).toFixed(2),
                    total: (Number(principal) * Number(monthlyInterest) * 3).toFixed(2),
                    index: i + 1
                })
            }
            arr.push({
                principal: principal,
                interest: (Number(principal) * Number(monthlyInterest) * mod).toFixed(2),
                total: (Number(principal) + Number(principal) * Number(monthlyInterest) * mod).toFixed(2),
                index: arr.length + 1
            })
        }
        let totalInterest = arr.reduce((total, current) => total + Number(current.interest), 0);
        return {
            repayPlan: arr,
            totalInterest: totalInterest.toFixed(2),
            totalAmount: (Number(principal) + Number(totalInterest)).toFixed(2),
        }
    },

    // 利随本清
    maturitySingleRepay(principal, term, interestRate) {
        let monthlyInterest = interestRate / 12;
        let arr = [{
            interest: (term * (Number(principal) * monthlyInterest)).toFixed(2),
            principal: Number(principal).toFixed(2),
            total: (term * (Number(principal) * monthlyInterest) + Number(principal)).toFixed(2),
            index: 1
        }];
        let totalInterest = arr.reduce((total, current) => total + Number(current.interest), 0);
        return {
            repayPlan: arr,
            totalInterest: totalInterest.toFixed(2),
            totalAmount: (Number(principal) + Number(totalInterest)).toFixed(2),
        }
    }
}