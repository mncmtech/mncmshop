package com.mncm.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.mncm.models.ContactMethodModel;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

/**
 * Created by sonudhakar on 24/03/18.
 */
@Data
public class ContactRequestModel  implements Serializable {

    @JsonProperty("contactModel")
    private ContactModel contactModel;

    @JsonProperty("linkedContactMethods")
    private List<ContactMethodModel> linkedContactMethods;

}
