module.exports = {
    formatUser(user) {
        return only(user, [ 'name', 'phone' ]);
    }
};