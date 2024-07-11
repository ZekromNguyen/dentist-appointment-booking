// controllers/profileController.js

import Account from '../model/account';
import ClinicOwner from '../model/clinicOwner';
import Customer from '../model/customer';
import Dentist from '../model/dentist';
import Role from '../model/role';

class ProfileController {
    async viewProfile(req, res) {
        try {
            const { accountId } = req.params;
            const account = await Account.findOne({
                where: { AccountID: accountId },
                include: [
                    { model: Customer, required: false },
                    { model: Dentist, required: false },
                    { model: ClinicOwner, required: false },
                    { model: Role, required: true }
                ]
            });

            if (!account) {
                return res.status(404).send("Account not found");
            }

            res.render("profile", {
                account,
                customer: account.Customer,
                dentist: account.Dentist,
                clinicOwner: account.ClinicOwner,
                role: account.Role
            });
        } catch (error) {
            console.error("Error fetching profile:", error);
            res.status(500).send("Internal server error");
        }
    }

    async editProfileForm(req, res) {
        try {
            const { accountId } = req.params;

            // Fetch the account details with related Customer, Dentist, ClinicOwner, and Role
            const account = await Account.findOne({
                where: { AccountID: accountId },
                include: [
                    { model: Customer, required: false },
                    { model: Dentist, required: false },
                    { model: ClinicOwner, required: false },
                    { model: Role, required: true }
                ]
            });

            if (!account) {
                return res.status(404).render('404', { message: 'Account not found' });
            }

            // Pass the data to the view
            res.render('editProfile', {
                account,
                customer: account.Customer,
                dentist: account.Dentist,
                clinicOwner: account.ClinicOwner,
                role: account.Role // Pass the role to the view
            });
        } catch (error) {
            console.error('Error fetching profile data:', error);
            res.status(500).send('Internal server error');
        }
    }

    async updateProfile(req, res) {
        try {
            const { accountId } = req.params;
            const { phone, customerName, dentistName, clinicOwnerName } = req.body;

            // Update account
            await Account.update({ Phone: phone }, { where: { AccountID: accountId } });

            // Update customer, dentist, or clinic owner details if they exist
            const customer = await Customer.findOne({ where: { AccountID: accountId } });
            if (customer) {
                await Customer.update({ CustomerName: customerName }, { where: { AccountID: accountId } });
            }

            const dentist = await Dentist.findOne({ where: { AccountID: accountId } });
            if (dentist) {
                await Dentist.update({ DentistName: dentistName }, { where: { AccountID: accountId } });
            }

            const clinicOwner = await ClinicOwner.findOne({ where: { AccountID: accountId } });
            if (clinicOwner) {
                await ClinicOwner.update({ ClinicOwnerName: clinicOwnerName }, { where: { AccountID: accountId } });
            }

            res.redirect(`/profile/${accountId}`);
        } catch (error) {
            console.error('Error updating profile:', error);
            res.status(500).send('Internal server error');
        }
    }
}
export default new ProfileController();
