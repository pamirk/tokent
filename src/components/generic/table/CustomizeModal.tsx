import { postUserConfig } from "api/ApiCalls"
import { useAuth } from "context/AuthContext"
import {
  borderColor,
  customTableOptionBackgroundColor,
  customTableOptionBorderColor,
  customTableOptionTextColor,
  customTableSelectedAreaColor,
} from "context/theme"
import React, { useEffect, useState } from "react"
import styled from "styled-components"
import Input from "../input/Input"
import Modal from "../modal/Modal"
import { ModalButton } from "../modal/ModalComponents"
import Tooltip from "../tooltip/Tooltip"
import {
  priceOptions,
  psOptions,
  volumeOptions,
  otherOptions,
  revenueOptions,
  marketCapOptions,
  protocolRevenueOptions,
  TVLOptions,
  OptionType,
  peOptions,
} from "./tableUtils"

type Props = {
  onSave: (options: OptionType[]) => void
  onClose: () => void
  selectedOptions: OptionType[]
}
const CustomizeTableModal = (props: Props) => {
  const { onSave, selectedOptions } = props
  const [selected, setSelected] = useState<OptionType[]>(selectedOptions)

  const selectedValues = selected.map((s) => s.value)

  const handleSelect = (option: OptionType) => {
    setSelected([...selected, option])
  }

  const handleUnSelect = (option: OptionType) => {
    setSelected(selected.filter((opt) => opt.value !== option.value))
  }

  return (
    <Modal
      show
      customButtons={<SaveSettings selectedItems={selected} />}
      submitButton={
        <ModalButton name="Clear" onClick={() => setSelected([])} />
      }
      closeText="Save"
      onClose={() => onSave(selected)}
    >
      <Title>{`Choose up to ${selected.length}/12 metrics`}</Title>
      <SelectedContainer>
        <SelectedItems>
          {selected.map((option) => (
            <Tooltip
              key={`tooltip-${option.value}`}
              id={`table-${option.value}`}
            >
              <Option
                onClick={() => handleUnSelect(option)}
                key={option.value}
                isSelected
              >
                {option.label}
              </Option>
            </Tooltip>
          ))}
        </SelectedItems>
      </SelectedContainer>
      <MultiSelect
        key="price"
        title="Price"
        options={priceOptions}
        onSelect={handleSelect}
        onUnSelect={handleUnSelect}
        selectedOptions={selectedValues}
      />
      <MultiSelect
        key="market_cap"
        title="Market cap"
        options={marketCapOptions}
        onSelect={handleSelect}
        onUnSelect={handleUnSelect}
        selectedOptions={selectedValues}
      />

      <MultiSelect
        key="volume"
        title="Volume"
        options={volumeOptions}
        onSelect={handleSelect}
        onUnSelect={handleUnSelect}
        selectedOptions={selectedValues}
      />
      <MultiSelect
        key="revenue"
        title="Revenue"
        options={revenueOptions}
        onSelect={handleSelect}
        onUnSelect={handleUnSelect}
        selectedOptions={selectedValues}
      />
      <MultiSelect
        key="protocol_revenue"
        title="Protocol revenue"
        options={protocolRevenueOptions}
        onSelect={handleSelect}
        onUnSelect={handleUnSelect}
        selectedOptions={selectedValues}
      />
      <MultiSelect
        key="tvl"
        title="TVL"
        options={TVLOptions}
        onSelect={handleSelect}
        onUnSelect={handleUnSelect}
        selectedOptions={selectedValues}
      />
      <MultiSelect
        key="ps"
        title="Price to sales"
        options={psOptions}
        onSelect={handleSelect}
        onUnSelect={handleUnSelect}
        selectedOptions={selectedValues}
      />
      <MultiSelect
        key="pe"
        title="Price to earnings"
        options={peOptions}
        onSelect={handleSelect}
        onUnSelect={handleUnSelect}
        selectedOptions={selectedValues}
      />
      <MultiSelect
        key="other"
        title="Other"
        options={otherOptions}
        onSelect={handleSelect}
        onUnSelect={handleUnSelect}
        selectedOptions={selectedValues}
      />
    </Modal>
  )
}

type SaveSettingsProps = { selectedItems: OptionType[] }

const SaveSettings = (props: SaveSettingsProps) => {
  const [name, setName] = useState("")
  const [isInputVisible, setIsInputVisible] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { user, updateUser, isLoggedIn } = useAuth()

  const { selectedItems } = props
  const handleSaveClick = () => {
    if (name === "") return

    const prevConfig = user.config ? user.config : {}
    const prevFavorites: { id: string; name: string }[] =
      prevConfig.favorites?.tables || []

    const favoritesWithSameName = prevFavorites.filter((f) => f.name === name)

    const newName =
      favoritesWithSameName.length > 0
        ? `${name} (${favoritesWithSameName.length})`
        : name

    const newFavorites = [
      ...prevFavorites,
      {
        id: `custom-table-${favoritesWithSameName.length}`,
        name: newName,
        items: selectedItems,
      },
    ]

    const newConfig = {
      ...prevConfig,
      favorites: { ...prevConfig.favorites, tables: newFavorites },
    }

    setIsSaving(true)

    postUserConfig(newConfig)
      .then(() => {
        updateUser({ ...user, config: newConfig })
      })
      .finally(() => {
        setIsInputVisible(false)
        setIsSaving(false)
      })
  }

  if (!isLoggedIn) return null
  return (
    <SaveSettingsContainer>
      {isInputVisible && (
        <>
          <Input placeholder="Name" onChange={setName} value={name} required />
          <SaveButton
            style={{ marginLeft: "15px" }}
            disabled={name === "" || isSaving}
            onClick={handleSaveClick}
          >
            {isSaving ? "Saving.." : "Save"}
          </SaveButton>
        </>
      )}
      {!isInputVisible && (
        <SaveButton onClick={() => setIsInputVisible(true)}>
          {"Save to favorites"}
        </SaveButton>
      )}
    </SaveSettingsContainer>
  )
}

const SaveSettingsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  foat: left;
  margin-right: auto;
  max-width: 250px;

  @media (max-width: 720px) {
    min-width: 100%;
    margin-bottom: 5px;
    margin-left: 10px;
  }
`

const SaveButton = styled.div<{ disabled?: boolean }>`
  border: 1px solid #00cf9d;
  width: fit-content;
  padding: 0px 10px;
  height: 24px;
  font-size: 11px;
  line-height: 100%;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  color: #00cf9d;
  cursor: pointer;
  opacity: ${(props) => (props.disabled ? "0.5" : "1")};
  pointer-events: ${(props) => (props.disabled ? "none" : "default")};

  @media (max-width: 720px) {
    width: 128px;
    padding: 0px 24px;
  }
`
export default CustomizeTableModal

const Title = styled.div`
  font-family: FKGrotesk-SemiMono;
`

const SelectedContainer = styled.div`
  background: ${customTableSelectedAreaColor};
  padding: 10px 4px;
  margin-top: 16px;
  margin-bottom: 32px;
`

const SelectedItems = styled.div`
  font-size: 15px;
  line-height: 24px;
  margin-bottom: 12px;
`

type MultiSelectProps = {
  title: string
  onSelect: (option: OptionType) => void
  onUnSelect: (option: OptionType) => void
  selectedOptions: string[]
  options: OptionType[]
}
const MultiSelect = ({
  title,
  onSelect,
  onUnSelect,
  options,
  selectedOptions,
}: MultiSelectProps) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([])

  useEffect(() => {
    if (selectedValues !== selectedOptions) {
      setSelectedValues(selectedOptions)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOptions])

  const handleClick = (option: OptionType) => {
    if (selectedValues.includes(option.value)) {
      onUnSelect(option)
      setSelectedValues(selectedValues.filter((val) => val !== option.value))
    } else {
      if (
        !selectedValues.includes(option.value) &&
        selectedOptions.length === 12
      )
        return
      onSelect(option)
      setSelectedValues([...selectedValues, option.value])
    }
  }

  return (
    <Container>
      <SectionTitle>{title}</SectionTitle>
      <SectionContents>
        {options.map((option) => (
          <Tooltip key={`tooltip-${option.value}`} id={`table-${option.value}`}>
            <Option
              key={`option-${option.value}`}
              disabled={
                !selectedValues.includes(option.value) &&
                selectedOptions.length === 12
              }
              isSelected={selectedValues.includes(option.value)}
              onClick={() => handleClick(option)}
            >
              {option.label}
            </Option>
          </Tooltip>
        ))}
      </SectionContents>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  border-bottom: 1px solid ${borderColor};
  margin-bottom: 12px;
  margin-left: -32px;
  margin-right: -32px;
  padding: 0px 32px;
`

const SectionTitle = styled.div`
  width: 20%;
  flex-shrink: 0;
  font-size: 12px;
  font-family: FKGrotesk-SemiMono;

  color: var(--text-color-sub);
`

const SectionContents = styled.div`
  text-align: right;
  -webkit-box-flex: 1;
  flex-grow: 1;
`
const Option = styled.div<{ isSelected?: boolean; disabled?: boolean }>`
  padding: 5px 12px;
  background: ${(props) =>
    props.isSelected ? "#00CF9D" : customTableOptionBackgroundColor};
  color: ${(props) => (props.isSelected ? "#FFF" : customTableOptionTextColor)};
  margin: 0px 4px 8px;
  font-size: 12px;
  font-weight: 600;
  font-family: FKGrotesk-SemiMono;
  line-height: 22px;
  cursor: ${(props) => (props.disabled ? "no-drop" : "pointer")};
  display: inline-flex;
  -webkit-box-align: center;
  align-items: center;
  transition: all 0.3s ease 0s;
  opacity: ${(props) => (props.disabled ? "0.7" : "1")};
  border: 1px solid
    ${(props) => (props.isSelected ? "unset" : customTableOptionBorderColor)};

  opacity: ${(props) => (props.isSelected ? 1 : 0.8)};
  &:hover {
    opacity: ${(props) => (props.isSelected ? 0.7 : 1)};
  }
`
