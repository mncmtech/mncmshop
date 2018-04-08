package com.mncm.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.googlecode.objectify.annotation.Cache;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Unindex;
import com.mncm.enums.AddressType;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * Created by sonudhakar on 29/07/17.
 */
@Data
public class Address implements Serializable {

    @JsonProperty("homeNumber")
    private String homeNumber;

    @JsonProperty("street")
    private String street;

    @JsonProperty("city")
    private String city;

    @JsonProperty("region")
    private String region;

    @JsonProperty("country")
    private String country;

    @JsonProperty("pincode")
    private int pincode;

    @JsonProperty("type")
    private AddressType type;

    @JsonProperty("primary")
    private Boolean primary;

}
