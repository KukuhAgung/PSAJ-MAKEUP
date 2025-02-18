import PageBreadcrumb from "@/components/organism/common/PageBreadCrumb";
import CheckboxComponents from "@/components/organism/form/form-elements/CheckboxComponents";
import DefaultInputs from "@/components/organism/form/form-elements/DefaultInputs";
import DropzoneComponent from "@/components/organism/form/form-elements/DropZone";
import FileInputExample from "@/components/organism/form/form-elements/FileInputExample";
import InputGroup from "@/components/organism/form/form-elements/InputGroup";
import InputStates from "@/components/organism/form/form-elements/InputStates";
import RadioButtons from "@/components/organism/form/form-elements/RadioButtons";
import SelectInputs from "@/components/organism/form/form-elements/SelectInputs";
import TextAreaInput from "@/components/organism/form/form-elements/TextAreaInput";
import ToggleSwitch from "@/components/organism/form/form-elements/ToggleSwitch";
import React from "react";

export default function FormElements() {
  return (
    <div>
      <PageBreadcrumb pageTitle="From Elements" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          <DefaultInputs />
          <SelectInputs />
          <TextAreaInput />
          <InputStates />
        </div>
        <div className="space-y-6">
          <InputGroup />
          <FileInputExample />
          <CheckboxComponents />
          <RadioButtons />
          <ToggleSwitch />
          <DropzoneComponent />
        </div>
      </div>
    </div>
  );
}
