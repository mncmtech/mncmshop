package com.mncm.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.mncm.enums.AccountType;
import com.mncm.enums.UserRole;
import com.mncm.models.Account;
import lombok.Data;

import java.io.Serializable;

/**
 * Created by sonudhakar on 24/03/18.
 */
@Data
public class SignupResponse  implements Serializable {

    @JsonProperty("contact")
    private Contact contact;

    @JsonProperty("role")
    private UserRole role;

    @JsonProperty("accountType")
    private AccountType accountType;
}
