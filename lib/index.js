// Thanks to /christo/validator.js for E-Mail + byte length functions

function getByteLength(str, min, max){
	var len = encodeURI(str).split(/%..|./).length - 1;
	return len
}

function normalizeEmail(email) {
	var parts = email.split('@', 2);
	parts[1] = parts[1].toLowerCase();
	if (parts[1] === 'gmail.com' || parts[1] === 'googlemail.com') {
		if (!parts[0].length) {
			return false;
		}
		parts[0] = parts[0].toLowerCase();
		parts[1] = 'gmail.com';
	} else if (options.lowercase) {
		parts[0] = parts[0].toLowerCase();
	}
	return parts.join('@');
};

module.exports = function(){
	var module = {}

	module.varError = function(error){
		this.LastError = error;
		return false;
	}

	module.String = function(value, def, min, max){
		if(!value && !def) 
			return this.varError("is unset");

		if(!value && def)
			return def;

		if(min)
			if(getByteLength(value)<min) return this.varError('is too short (min length is '+min+')');

		if(max)
			if(getByteLength(value)>max) return this.varError('is too long (max length is '+max+')');

		return value;
	}

	module.FQDN = function(value, def){
		var parts = str.split('.');
		for (var part, i = 0; i < parts.length; i++) {
			part = parts[i];

			if (!/^[a-z\u00a1-\uffff0-9-]+$/i.test(part)) {
				return this.varError('is not a valid domain');
			}
			if (/[\uff01-\uff5e]/.test(part)) {
				return this.varError('is not a valid domain');
			}
			if (part[0] === '-' || part[part.length - 1] === '-') {
				return this.varError('is not a valid domain');
			}
			if (part.indexOf('---') >= 0 && part.slice(0, 4) !== 'xn--') {
				return this.varError('is not a valid domain');
			}
		}
		return value
	}

	module.Int = function(value, def, min, max){
		if(!value && !def) 
			return this.varError("is unset");

		if(!value && def)
			return def;

		if (!((!isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value))))) return this.varError('is not a valid integer');

		if(min)
			if(getByteLength(value)<min) return this.varError('is too small (min size is '+min+')');

		if(max)
			if(getByteLength(value)>max) return this.varError('is too big (max length is '+max+')');

		return Number(value);
	}

	module.Float = function(value, def, min, max){
		if(!value && !def) 
			return this.varError("is unset");

		if(!value && def)
			return def;

		if(isNan(parseFloat(value))) return this.varError('is not a valid float');

		if(min)
			if(getByteLength(value)<min) return this.varError('is too small (min size is '+min+')');

		if(max)
			if(getByteLength(value)>max) return this.varError('is too big (max length is '+max+')');

		return parseFloat(value)
	}

	module.Email = function(value, def){
		var value = this.String(value, def, 5);
		if(!value) return false;

		var parts = value.split('@') 
		, domain = parts.pop()
		, user = parts.join('@');

		var lower_domain = domain.toLowerCase();
		if (lower_domain === 'gmail.com' || lower_domain === 'googlemail.com') {
			user = user.replace(/\./g, '').toLowerCase();
		}

		if (!(getByteLength(user)>64) ||!(getByteLength(domain)>256)) {
			return this.varError('is not a valid E-Mail');
		}

		if(!this.FQDN(domain)) return this.varError('is not a valid E-Mail');

		value = normalizeEmail(value);

		var re = "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?";
		if(!value.test(re)) return this.varError('is not a valid E-Mail');

		return value;
	}

	return module;
}
