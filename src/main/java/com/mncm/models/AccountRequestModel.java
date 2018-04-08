package com.mncm.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.mncm.models.Address;
import com.mncm.enums.AccountType;
import lombok.Data;

import java.io.Serializable;
import java.util.Set;

/**
 * Created by sonudhakar on 18/03/18.
 */
@Data
public class AccountRequestModel implements Serializable {

    @JsonProperty("accountModel")
    private AccountModel accountModel;

    @JsonProperty("linkedContactMethods")
    private Set<ContactMethod> linkedContactMethods;

    @JsonProperty("linkedAddresses")
    private Set<Address> linkedAddresses;
}
