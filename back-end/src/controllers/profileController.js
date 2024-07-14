// controllers/profileController.js
import {
    Account,
    Customer,
    Dentist,
    ClinicOwner,
    Role,
} from "../model/model";

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
                return res.status(404).json({ error: "Account not found" });
            }

            const profileData = {
                AccountID: account.AccountID,
                UserName: account.UserName,
                Email: account.Email,
                Phone: account.Phone,
                Role: account.Role ? account.Role.RoleName : 'No role assigned',
                CustomerName: account.Customer ? account.Customer.CustomerName : null,
                DentistName: account.Dentist ? account.Dentist.DentistName : null,
                ClinicOwnerName: account.ClinicOwner ? account.ClinicOwner.ClinicOwnerName : null
            };

            console.log("Profile Data:", profileData); // Debug log
            res.json(profileData);
        } catch (error) {
            console.error("Error fetching profile:", error);
            res.status(500).json({ error: "Internal server error" });
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

            // Prepare data to send to the editProfile view
            const profileData = {
                AccountID: account.AccountID,
                UserName: account.UserName,
                Email: account.Email,
                Phone: account.Phone,
                Role: account.Role ? account.Role.RoleName : 'No role assigned',
                CustomerName: account.Customer ? account.Customer.CustomerName : null,
                DentistName: account.Dentist ? account.Dentist.DentistName : null,
                ClinicOwnerName: account.ClinicOwner ? account.ClinicOwner.ClinicOWnerName : null
            };

            res.render('editProfile', { profileData });
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
                await ClinicOwner.update({ ClinicOWnerName: clinicOwnerName }, { where: { AccountID: accountId } });
            }

            res.redirect(`/profile/${accountId}`);
        } catch (error) {
            console.error('Error updating profile:', error);
            res.status(500).send('Internal server error');
        }
    }
}

export default new ProfileController();
