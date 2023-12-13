const fetch = require("node-fetch");

/**
 * @param {*} token
 * @param {string} name - required
 * @param {number} gradeId - required
 * @param {number|null} boardId - optional
 * @param {string|null} gender - male/female - optional
 * @param {string|null} country - optional
 */
const provisionUser = async (
    token,
    name,
    gradeId,
    boardId = null,
    gender = null,
    country = null
) => {
    const profileUpdateUrl = `${process.env.FILO_HOST}/vendor/${process.env.FILO_PARTNER_ID}/users`;
    const userResp = await fetch(profileUpdateUrl, {
        method: "POST",
        body: JSON.stringify({
            token,
            name,
            gradeId,
            boardId,
            gender,
            country,
        }),
        headers: { "Content-Type": "application/json" },
    });
    if (userResp.status !== 200) {
        console.error("unable to provision user with filo", {
            status: userResp.status,
        });
        throw new Error("unable to provision user with filo");
    }

    return await userResp.json();
};

/**
 * Credit wallet of a user in filo to take sessions
 * @param token - JWT token os user
 * @param amount
 * @param referenceId - unique referenceId id for this transaction
 * @returns {Promise<any>}
 */
const creditStudentWallet = async (token, amount, referenceId) => {
    const creditWalletApi = `${process.env.FILO_HOST}/vendor/${process.env.FILO_PARTNER_ID}/user/wallet/credit`;
    const response = await fetch(creditWalletApi, {
        method: "POST",
        body: JSON.stringify({
            token,
            amount,
            referenceId,
        }),
        headers: {"Content-Type": "application/json"},
    });
    if (response.status !== 200) {
        console.error("unable to credit user filo wallet", {
            status: response.status,
        });
        throw new Error("unable to credit user filo wallet");
    }

    return await response.json();
};

/**
 * Get user wallet details
 * @param token
 * @param amount
 * @param referenceId
 * @returns {Promise<any>}
 */
const getUserWalletDetails = async (token) => {
    const creditWalletApi = `${process.env.FILO_HOST}/vendor/${process.env.FILO_PARTNER_ID}/user/wallet/details`;
    const response = await fetch(creditWalletApi, {
        method: "POST",
        body: JSON.stringify({
            token,
        }),
        headers: {"Content-Type": "application/json"},
    });
    if (response.status !== 200) {
        console.error("unable to get user filo wallet", {
            status: response.status,
        });
        throw new Error("unable to get user filo wallet");
    }

    return await response.json();
}

module.exports = {provisionUser, creditStudentWallet, getUserWalletDetails}