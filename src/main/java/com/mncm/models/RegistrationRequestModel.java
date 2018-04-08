package com.mncm.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.mncm.models.ContactModel;
import lombok.Data;

import java.io.Serializable;

/**
 * Created by sonudhakar on 03/09/17.
 */
@Data
public class RegistrationRequestModel  implements Serializable {

    @JsonProperty("contact")
    private ContactRequestModel contact;

    @JsonProperty("account")
    private AccountRequestModel account;
}
