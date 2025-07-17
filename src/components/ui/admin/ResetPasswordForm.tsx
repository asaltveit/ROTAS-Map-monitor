// Based on https://blog.stackademic.com/create-a-login-form-with-react-hook-form-package-ab1634a206c9
'use client'

import { resetPassword } from '@/app/login/actions';
import Form from './Form';

// TODO: put these directly into the page?

const ResetPasswordForm = () => {
    /*
        - didn't put in test account
        isCapitalLetter: (value) =>
            /[A-Z]/.test(value) ||
            "Password should have at least one capital letter",

        Needs:
        - Styling - replace TailwindCSS
        - More validation?
        - Check for active sessions?
        Add header/title here?
    */

    return (
        <div>
            <Form action={resetPassword} submitText='Reset password'></Form>
        </div>
    );
};

export default ResetPasswordForm;