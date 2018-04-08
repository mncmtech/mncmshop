package com.mncm.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.mncm.enums.ContactMethodType;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * Created by sonudhakar on 18/03/18.
 */
@Data
@NoArgsConstructor
public class ContactMethod implements Serializable{

    private static final long serialVersionUID = 2030868478669707759L;

    @JsonProperty("id")
    private String id;

    @JsonProperty("key")
    private String key;

    @JsonProperty("value")
    private String value;

    @JsonProperty("primary")
    private boolean primary;

    @JsonProperty("type")
    private ContactMethodType type;
}
