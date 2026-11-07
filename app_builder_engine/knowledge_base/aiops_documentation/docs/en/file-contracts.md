# File Contracts

> Language: EN | [Português (pt-BR)](../pt-BR/file-contracts.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Guidance for documenting **file-based** (or file-like artifact) integrations.

Do **not** assume CSV. Formats may include CSV, JSON, XML, Parquet, plain text, binary, or other project formats — record the actual one.

## Document When Applicable

| Topic | Guidance |
| --- | --- |
| Filename | Pattern, uniqueness, sequencing |
| Format | Actual format(s) supported |
| Encoding | Character encoding / binary conventions |
| Schema | Record/field structure ([schema-documentation.md](schema-documentation.md)) |
| Delimiter | Only if relevant to the format |
| Header | Presence and meaning of header rows / metadata files |
| Required fields | Structural and business requirements |
| Validation | [contract-validation.md](contract-validation.md) |
| Size | Max size, row counts, split rules |
| Frequency | Schedule, trigger, or ad-hoc |
| Producer | Who writes/publishes the file |
| Consumer | Who reads/imports |
| Delivery | How the file is exchanged (drop path, object store, transfer — project terms) |
| Retention | How long files remain; archival/deletion |
| Failure handling | Partial files, corrupt files, retries, quarantine |

## Semantics Matter

Field meaning in batch files is a frequent source of silent breakage. Apply [semantic-contracts.md](semantic-contracts.md) (units, dates, nulls, codes).

## Partial and Late Files

Document expectations for:

- incomplete uploads;
- late arrivals relative to a business deadline ([timing-contract.md](timing-contract.md));
- duplicate file delivery;
- schema evolution across file versions.

## Related Documents

- [contract-types.md](contract-types.md)
- [schema-documentation.md](schema-documentation.md)
- [contract-validation.md](contract-validation.md)
- [timing-contract.md](timing-contract.md)
- [delivery-semantics.md](delivery-semantics.md)
